from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import control
import numpy as np

app = FastAPI(title="Control Systems API", version="1.0.0")

MAX_TIME_POINTS = 100
MAX_TIME_END = 5
MAX_POLY_DEGREE = 10

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://controle.malcong.com.br"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransferFunctionInput(BaseModel):
    numerator: List[float]
    denominator: List[float]
    time_points: int = 100
    time_end: float = 10.0

class ChartDataPoint(BaseModel):
    x: float
    y: float

class ResponseData(BaseModel):
    data: List[ChartDataPoint]
    label: str
    metadata: Dict[str, Any]

class TransferFunctionResponse(BaseModel):
    step_response: ResponseData
    impulse_response: ResponseData
    ramp_response: ResponseData
    step_info: Dict[str, Any]
    success: bool
    message: str

def format_response_for_chartjs(time_data, amplitude_data, label="Response"):
    """
    Convert control system response data to Chart.js format
    Returns data in {x, y} format for Chart.js scatter/line plots
    """
    return ResponseData(
        data=[ChartDataPoint(x=float(t), y=float(y)) for t, y in zip(time_data, amplitude_data)],
        label=label,
        metadata={
            "length": len(time_data),
            "time_range": [float(time_data[0]), float(time_data[-1])],
            "amplitude_range": [float(np.min(amplitude_data)), float(np.max(amplitude_data))],
            "settling_time": float(time_data[-1]),
            "final_value": float(amplitude_data[-1])
        }
    )

@app.get("/")
async def root():
    return {"message": "Control Systems API", "version": "1.0.0"}



def validate_transfer_function(tf_input: TransferFunctionInput):
    tf_input.time_points = max(1, min(tf_input.time_points, MAX_TIME_POINTS)) 
    tf_input.time_end = max(0.01, min(tf_input.time_end, MAX_TIME_END))
    
    if len(tf_input.numerator) > len(tf_input.denominator):
        # flopou, não é uma TF própria
        raise ValueError("Denominador deve ter um grau maior que o numerador para que a FT seja própria.")
    
    if (len(tf_input.numerator) > (MAX_POLY_DEGREE + 1) or len(tf_input.denominator) > (MAX_POLY_DEGREE + 1)):
        # não queremos calcular graus muito altos
        raise ValueError(f"O maior grau possível do numerador ou do denominador é {MAX_POLY_DEGREE}.")
    
@app.post("/api/transfer-function", response_model=TransferFunctionResponse)
async def analyze_transfer_function(tf_input: TransferFunctionInput):
    """
    Analyze a transfer function and return step and impulse responses
    formatted for Chart.js plotting
    """
    try:
        # evita sacaninhas estourando a memória da máquina >:)
        validate_transfer_function(tf_input)
        
        tf = control.tf(tf_input.numerator, tf_input.denominator)

        time_vector = np.linspace(0, tf_input.time_end, tf_input.time_points)  
        
        step_time, step_response = control.step_response(tf, time_vector)
        
        impulse_time, impulse_response = control.impulse_response(tf, time_vector)
        
        step_info = extended_step_info(step_response, control.step_info(tf), step_time,tf)

        s = control.tf('s')
        ramp_time, ramp_response = control.step_response(tf / s, time_vector) 
        
        step_data = format_response_for_chartjs(
            step_time, step_response, "Step Response"
        )
        
        impulse_data = format_response_for_chartjs(
            impulse_time, impulse_response, "Impulse Response"
        )
        
        ramp_data = format_response_for_chartjs(
            ramp_time, ramp_response, "Ramp Response"
        )

        
        return TransferFunctionResponse(
            step_response=step_data,
            impulse_response=impulse_data,
            ramp_response=ramp_data,
            success=True,
            step_info=step_info,
            message="Transfer function analyzed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao Analisar a Função de Transferência: {str(e)}")

@app.post("/api/step-response")
async def get_step_response(tf_input: TransferFunctionInput):
    try:
        tf = control.tf(tf_input.numerator, tf_input.denominator)
        time_vector = np.linspace(0, tf_input.time_end, tf_input.time_points)
        step_time, step_response = control.step_response(tf, time_vector)
        
        return format_response_for_chartjs(step_time, step_response, "Step Response")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating step response: {str(e)}")

@app.post("/api/impulse-response")
async def get_impulse_response(tf_input: TransferFunctionInput):
    try:
        tf = control.tf(tf_input.numerator, tf_input.denominator)
        time_vector = np.linspace(0, tf_input.time_end, tf_input.time_points)
        impulse_time, impulse_response = control.impulse_response(tf, time_vector)
        
        return format_response_for_chartjs(impulse_time, impulse_response, "Impulse Response")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating impulse response: {str(e)}")

@app.get("/api/example")
async def get_example():
    example_input = TransferFunctionInput(
        numerator=[16],
        denominator=[1, 5.6, 16],
        time_points=50,
        time_end=5.0
    )
    return await analyze_transfer_function(example_input)


def extended_step_info(step_response, step_info, step_time,tf):
    """
    Augment step_info with:
    - RiseTime_0_to_100
    - SettlingTime5 (5% criteria)
    """
    steady_state_value = step_info.get('SteadyStateValue', step_response[-1])

    # === 0% to 100% Rise Time ===
    try:
        t_0_index = np.where(step_response >= 0.0 * steady_state_value)[0]
        t_100_index = np.where(step_response >= 1.0 * steady_state_value)[0]

        if t_0_index.size > 0 and t_100_index.size > 0:
            t_0 = step_time[t_0_index[0]]
            t_100 = step_time[t_100_index[0]]
            rise_time_0_to_100 = t_100 - t_0
        else:
            rise_time_0_to_100 = None
    except Exception:
        rise_time_0_to_100 = None

    step_info['RiseTime_0_to_100'] = rise_time_0_to_100
    
    # === Settling Time (5% criteria) ===
    step_info['SettlingTime5'] = control.step_info(tf, SettlingTimeThreshold=0.05).get("SettlingTime", None)
    
    return step_info

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)