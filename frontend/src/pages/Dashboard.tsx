import { useEffect, useState } from 'react';
import { StepInfoCard } from '@/components/step-info-card';
import { useSearchParams } from 'react-router-dom';
import { chartOptions } from '@/config/chart';
import { TransferFunctionResponse, ResponseData, StepInfo, ChartData } from '@/types';
import { toast } from 'sonner';

import {
    Chart,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    CategoryScale,
    Tooltip,
    Legend
} from 'chart.js';
import { ChartCard } from '@/components/chart-card';
import { TransferFunctionForm } from '@/components/transfer-function-form';
import { FormulaCard } from '@/components/formula-card';
import { getCoefsFromString } from '@/lib/utils';

Chart.register(
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    CategoryScale,
    Tooltip,
    Legend
);


export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const numeratorParam = searchParams.get('numerator') || '';
    const denominatorParam = searchParams.get('denominator') || '';

    const [numerator, setNumerator] = useState(numeratorParam);
    const [denominator, setDenominator] = useState(denominatorParam);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [timePoints, setTimePoints] = useState(40);
    const [timeEnd, setTimeEnd] = useState(5.0);

    useEffect(() => {
        if (numeratorParam && denominatorParam) {
            handleTransferFunction();
        }
    }, [numeratorParam, denominatorParam]);

    const [stepData, setStepData] = useState<ChartData>({
        labels: [],
        datasets: []
    });

    const [impulseData, setImpulseData] = useState<ChartData>({
        labels: [],
        datasets: []
    });

     const [rampData, setRampData] = useState<ChartData>({
        labels: [],
        datasets: []
    });

    const [stepInfo, setStepInfo] = useState<StepInfo | null>(null);

    const API_BASE_URL = 'http://localhost:8000';

    const formatApiDataForChart = (responseData: ResponseData, color: string): ChartData => {
        return {
            labels: responseData.data.map(point => point.x),
            datasets: [{
                label: responseData.label,
                data: responseData.data,
                borderColor: color,
                backgroundColor: color.replace('1)', '0.2)'),
                fill: false,
                tension: 0.1,
                pointRadius: 1,
            }]
        };
    };

    const formatRampDataForChart = (responseData: ResponseData, responseColor: string, rampColor: string): ChartData => {
        const rampData = formatApiDataForChart(responseData, responseColor);
        rampData.datasets.push({
                label: "Ramp",
                data: responseData.data.map(point => {return {x: point.x, y: point.x}}),
                borderColor: rampColor,
                backgroundColor: rampColor.replace('1)', '0.2)'),
                fill: false,
                tension: 0.1,
                pointRadius: 1,
            })
            return rampData
    }

    const handleTransferFunction = async () => {
        if (!numerator || !denominator) return;

        setLoading(true);
        setError('');

        try {
            const requestBody = {
                numerator: getCoefsFromString(numerator).map(Number),
                denominator: getCoefsFromString(denominator).map(Number),
                time_points: timePoints,
                time_end: timeEnd
            };
            const response = await fetch(`${API_BASE_URL}/api/transfer-function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.detail || `HTTP error! status: ${response.status}`);
                return;
            }

            const data: TransferFunctionResponse = await response.json();
            if (data.success) {
                setStepData(formatApiDataForChart(data.step_response, 'rgba(75, 192, 192, 1)'));
                setImpulseData(formatApiDataForChart(data.impulse_response, 'rgba(255, 99, 132, 1)'));
                setRampData(formatRampDataForChart(data.ramp_response, 'rgba(255, 205, 86, 1)', 'rgba(60, 244, 35, 1)'));
                setStepInfo(data.step_info)
            } else {
                toast.error(data.detail || data.message || 'Erro ao calcular função de transferência');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            toast.error('Erro ao conectar com o servidor. Verifique se a API está rodando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormulaCard numerator={numerator} denominator={denominator} />

                <TransferFunctionForm
                    numerator={numerator}
                    denominator={denominator}
                    setNumerator={setNumerator}
                    setDenominator={setDenominator}
                    timeEnd={timeEnd}
                    setTimeEnd={setTimeEnd}
                    timePoints={timePoints}
                    setTimePoints={setTimePoints}
                    loading={loading}
                    onSubmit={handleTransferFunction}
                    error={error}
                />
                <ChartCard
                    title="Resposta ao Impulso"
                    data={impulseData}
                    loading={loading}
                    emptyMessage="Configure a função de transferência para visualizar a resposta ao impulso"
                    chartOptions={chartOptions}
                />

                <ChartCard
                    title="Resposta ao Degrau"
                    data={stepData}
                    loading={loading}
                    emptyMessage="Configure a função de transferência para visualizar a resposta ao degrau"
                    chartOptions={chartOptions}
                />

                <ChartCard
                    title="Comparação - Degrau vs Impulso"
                    data={{
                        datasets: [
                            ...stepData.datasets,
                            ...impulseData.datasets
                        ]
                    }}
                    loading={loading}
                    emptyMessage="Configure a função de transferência para visualizar a comparação"
                    chartOptions={chartOptions}
                />

                <StepInfoCard stepInfo={stepInfo} />
                
                <ChartCard
                    title="Resposta à Rampa"	
                    data={rampData}
                    loading={loading}
                    emptyMessage="Configure a função de transferência para visualizar a resposta à rampa"
                    chartOptions={chartOptions}
                />
            </div>

        </div>
    );
}
