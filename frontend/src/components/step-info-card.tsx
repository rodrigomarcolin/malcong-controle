import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
                    <InfoItem label="Tempo de Subida" value={formatValue(stepInfo.RiseTime, 's')} />
                    <InfoItem label="Tempo de Acomodação" value={formatValue(stepInfo.SettlingTime, 's')} />
                    <InfoItem label="Mínimo na Acomodação" value={formatValue(stepInfo.SettlingMin)} />
                    <InfoItem label="Máximo na Acomodação" value={formatValue(stepInfo.SettlingMax)} />
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