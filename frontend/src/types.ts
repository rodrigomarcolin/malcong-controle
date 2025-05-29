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
    RiseTime: number | null;
    SettlingTime: number | null;
    SettlingMin: number | null;
    SettlingMax: number | null;
    Overshoot: number | null;
    Undershoot: number | null;
    Peak: number | null;
    PeakTime: number | null;
    SteadyStateValue: number | null;
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