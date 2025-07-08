
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type MapaMentalTabProps = {
  mentoradoId: string;
};

export function MapaMentalTab({ mentoradoId }: MapaMentalTabProps) {
  const [mindMeisterUrl, setMindMeisterUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Em uma implementação real, buscaríamos esse dado do banco
  const mockMindMeisterUrl = "https://www.mindmeister.com/map/123456";

  const handleSaveUrl = () => {
    setIsLoading(true);
    
    // Simulação de salvar URL
    setTimeout(() => {
      setIsLoading(false);
      setIsConfigured(true);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa Mental do Mentorado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConfigured ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Insira o link compartilhável do Mind Meister para o mapa mental deste mentorado.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.mindmeister.com/map/..."
                value={mindMeisterUrl}
                onChange={(e) => setMindMeisterUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSaveUrl} 
                disabled={!mindMeisterUrl || isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Mapa mental configurado
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsConfigured(false)}
              >
                Alterar
              </Button>
            </div>
            <div className="aspect-video w-full border rounded-lg overflow-hidden">
              <iframe
                src={mockMindMeisterUrl} 
                width="100%"
                height="100%"
                title="Mind Meister Map"
                className="border-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Esse mapa mental está visível para o mentorado e para os dependentes com permissão de leitura.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
