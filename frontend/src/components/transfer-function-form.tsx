import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  numerator: string;
  denominator: string;
  setNumerator: (value: string) => void;
  setDenominator: (value: string) => void;
  onSubmit: (numerator: string, denominator: string) => void;
  error?: string;
}

export function TransferFunctionForm({
  loading,
  onSubmit,
  error,
  numerator,
  setNumerator,
  denominator,
  setDenominator
}: Props) {

  const handleSubmit = () => {
    onSubmit(numerator, denominator);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="text-lg font-semibold text-center">Configure a Função de Transferência</h2>
      </CardHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="numerador">Numerador</Label>
          <Input
            id="numerador"
            type="text"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            placeholder="Ex: 16 para numerador constante"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="denominador">Denominador</Label>
          <Input
            id="denominador"
            type="text"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            placeholder="Ex: 1,5.6,16 para s² + 5.6s + 16"
            disabled={loading}
          />
        </div>
        <Button
          className="w-full"
          disabled={!numerator || !denominator || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Calculando...' : 'Analisar Sistema'}
        </Button>
        {error && (
          <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
