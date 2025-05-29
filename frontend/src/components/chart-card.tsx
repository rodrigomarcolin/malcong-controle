import { Card, CardHeader } from "@/components/ui/card";
import { Chart } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";


/* eslint-disable  @typescript-eslint/no-explicit-any */

interface ChartCardProps {
    title: string;
    data: any;
    loading: boolean;
    emptyMessage: string;
    chartOptions: any;
}

const LoadingSkeleton = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="text-center space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <div className="animate-pulse">Carregando gráfico...</div>
        </div>
    </div>
);

export const ChartCard = ({
    title,
    data,
    loading,
    emptyMessage,
    chartOptions
}: ChartCardProps) => {
    const hasData = data?.datasets?.length > 0;

    return (
        <Card className="p-4">
            <CardHeader>
                <h2 className="text-lg text-center font-semibold">{title}</h2>
            </CardHeader>
            {loading ? (
                <LoadingSkeleton />
            ) : hasData ? (
                <div className="h-64">
                    <Chart
                        type="line"
                        data={data}
                        options={chartOptions}
                    />
                </div>
            ) : (
                <div className="h-64 rounded-lg flex items-center justify-center text-center px-4">
                    {emptyMessage}
                </div>
            )}
        </Card>
    );
};
