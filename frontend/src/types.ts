export interface DataPoint {
    x: number;
    y: number;
}

export interface ResponseData {
    data: DataPoint[];
    label: string;
    metadata: {
        length: number;
        time_range: [number, number];
        amplitude_range: [number, number];
        final_value: number;
    };
}



export interface StepInfo {
    RiseTime: number;
    SettlingTime: number;
    SettlingMin: number;
    SettlingMax: number;
    Overshoot: number;
    Undershoot: number;
    Peak: number;
    PeakTime: number;
    SteadyStateValue: number;
}

export interface TransferFunctionResponse {
    transfer_function: string;
    step_response: ResponseData;
    impulse_response: ResponseData;
    success: boolean;
    step_info: StepInfo;
    message: string;
}

// Chart.js data format
export interface ChartData {
    labels: number[];
    datasets: {
        label: string;
        data: DataPoint[];
        borderColor: string;
        backgroundColor: string;
        fill?: boolean;
        tension?: number;
        pointRadius?: number;
    }[];
}