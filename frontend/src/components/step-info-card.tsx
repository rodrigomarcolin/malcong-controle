import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

    return (
        <Card className="p-4">
            <CardHeader>
                <h2 className="text-lg font-semibold text-center">
                    Informações da Resposta ao Degrau
                </h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Tempo de Subida" value={`${stepInfo.RiseTime.toFixed(3)} s`} />
                    <InfoItem label="Tempo de Acomodação" value={`${stepInfo.SettlingTime.toFixed(3)} s`} />
                    <InfoItem label="Mínimo na Acomodação" value={stepInfo.SettlingMin.toFixed(3)} />
                    <InfoItem label="Máximo na Acomodação" value={stepInfo.SettlingMax.toFixed(3)} />
                    <InfoItem label="Overshoot" value={`${stepInfo.Overshoot.toFixed(2)} %`} />
                    <InfoItem label="Undershoot" value={`${stepInfo.Undershoot.toFixed(2)} %`} />
                    <InfoItem label="Valor de Pico" value={stepInfo.Peak.toFixed(3)} />
                    <InfoItem label="Tempo de Pico" value={`${stepInfo.PeakTime.toFixed(3)} s`} />
                    <InfoItem label="Valor de Regime" value={stepInfo.SteadyStateValue.toFixed(3)} />
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
