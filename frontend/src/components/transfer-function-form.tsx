import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { baseUrl } from "@/config/app";
import { toast } from "sonner";
import { Settings } from "lucide-react";

interface Props {
  loading: boolean;
  numerator: string;
  denominator: string;
  setNumerator: (value: string) => void;
  setDenominator: (value: string) => void;
  onSubmit: (numerator: string, denominator: string) => void;
  timePoints: number;
  setTimePoints: (value: number) => void;
  timeEnd: number;
  setTimeEnd: (value: number) => void;
  error?: string;
}


export function TransferFunctionForm({
  loading,
  onSubmit,
  error,
  numerator,
  setNumerator,
  denominator,
  setDenominator,
  timePoints,
  setTimePoints,
  timeEnd,
  setTimeEnd
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = () => {
    onSubmit(numerator, denominator);
  };

  const handleShareUrl = () => {
    const url = `${baseUrl}/?numerator=${encodeURIComponent(numerator)}&denominator=${encodeURIComponent(denominator)}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copiada para a área de transferência!");
  };

  return (
    <Card className="p-4 relative">
      <CardHeader className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-center w-full">
          Configure a Função de Transferência
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
        </button>
      </CardHeader>


        {/* Settings Dropdown */}
        {showSettings && (
          <div className="border rounded-md bg-muted/30 p-3 h-32">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label>Pontos no Tempo ({timePoints})</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[timePoints]}
                  onValueChange={([v]) => setTimePoints(v)}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tempo Final (s) ({timeEnd})</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
                  value={[timeEnd]}
                  onValueChange={([v]) => setTimeEnd(Number(v.toFixed(1)))}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!showSettings && (<>
          <div className="space-y-2 h-32">
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
          </div>
        </>)}


        <Button
          className="w-full"
          disabled={!numerator || !denominator || loading}
          onClick={handleSubmit}
        >
          {loading ? "Calculando..." : "Analisar Sistema"}
        </Button>

        <Button
          className="w-full"
          variant="secondary"
          onClick={handleShareUrl}
          disabled={!numerator || !denominator}
        >
          Compartilhar Sistema
        </Button>

        {error && (
          <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

    </Card>
  );
}
