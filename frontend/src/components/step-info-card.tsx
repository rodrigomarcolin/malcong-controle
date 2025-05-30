import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StepInfo } from "@/types";

interface StepInfoCardProps {
    stepInfo: StepInfo | null;
}

export const StepInfoCard = ({ stepInfo }: StepInfoCardProps) => {
    if (!stepInfo) {
        return (
            <Card className="p-4">
                <CardHeader>
                    <h2 className="text-lg font-semibold text-center">
                        Informações da Resposta ao Degrau
                    </h2>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    Calcule a função de transferência para ver os dados de desempenho.
                </CardContent>
            </Card>
        );
    }

    const formatValue = (value: number | null, unit: string = '', precision: number = 3) => {
        if (value === null) return 'N/A';
        return `${value.toFixed(precision)}${unit ? ` ${unit}` : ''}`;
    };

    return (
        <Card className="p-4">
            <CardHeader>
                <h2 className="text-lg font-semibold text-center">
                    Informações da Resposta ao Degrau
                </h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Tempo de Subida (10% a 90%)" value={formatValue(stepInfo.RiseTime, 's')} />
                    <InfoItem label="Tempo de Subida (0% a 100%)" value={formatValue(stepInfo.RiseTime_0_to_100, 's')} />
                    <InfoItem label="Tempo de Acomodação (2%)" value={formatValue(stepInfo.SettlingTime, 's')} />
                    <InfoItem label="Tempo de Acomodação (5%)" value={formatValue(stepInfo.SettlingTime5, 's')} />
                    <InfoItem label="Overshoot" value={formatValue(stepInfo.Overshoot, '%', 2)} />
                    <InfoItem label="Undershoot" value={formatValue(stepInfo.Undershoot, '%', 2)} />
                    <InfoItem label="Valor de Pico" value={formatValue(stepInfo.Peak)} />
                    <InfoItem label="Tempo de Pico" value={formatValue(stepInfo.PeakTime, 's')} />
                    <InfoItem label="Valor de Regime" value={formatValue(stepInfo.SteadyStateValue)} />
                </div>
            </CardContent>
        </Card>
    );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b pb-1">
        <span className="font-medium">{label}</span>
        <span>{value}</span>
    </div>
);