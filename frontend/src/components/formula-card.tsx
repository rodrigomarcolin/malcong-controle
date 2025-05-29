import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPolynomialFromString } from "@/lib/utils";

interface FormulaCardProps {
  numerator: string;
  denominator: string;
}

export function FormulaCard({ numerator, denominator }: FormulaCardProps) {
  const renderFormula = () => {
    const num = numerator || 'Digite o numerador';
    const den = denominator || 'Digite o denominador';

    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="font-mono text-xl">{formatPolynomialFromString(num)}</div>
        <div className="w-32 border-t-2 border-red-500" />
        <div className="font-mono text-xl">{formatPolynomialFromString(den)}</div>
      </div>
    );
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Representação da Função de Transferência
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-center h-40">
        {renderFormula()}
      </div>
    </Card>
  );
}
