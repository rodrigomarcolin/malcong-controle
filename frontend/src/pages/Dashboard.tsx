import { useEffect, useState } from 'react';
import { StepInfoCard } from '@/components/step-info-card';
import { useSearchParams } from 'react-router-dom';
import { chartOptions } from '@/config/chart';
import { TransferFunctionResponse, ResponseData, StepInfo, ChartData } from '@/types';

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

    const [stepInfo, setStepInfo] = useState<StepInfo | null>(null);

    const API_BASE_URL = 'https://controle.malcong.com.br';

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

    const handleTransferFunction = async () => {
        if (!numerator || !denominator) return;

        setLoading(true);
        setError('');

        try {
            const requestBody = {
                numerator: getCoefsFromString(numerator).map(Number),
                denominator: getCoefsFromString(denominator).map(Number),
                time_points: 40,
                time_end: 3.0
            };

            const response = await fetch(`${API_BASE_URL}/api/transfer-function`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: TransferFunctionResponse = await response.json();

            if (data.success) {
                setStepData(formatApiDataForChart(data.step_response, 'rgba(75, 192, 192, 1)'));
                setImpulseData(formatApiDataForChart(data.impulse_response, 'rgba(255, 99, 132, 1)'));
                setStepInfo(data.step_info)
            } else {
                setError(data.message || 'Erro ao calcular função de transferência');
            }

        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor. Verifique se a API está rodando.');
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
            </div>

        </div>
    );
}
