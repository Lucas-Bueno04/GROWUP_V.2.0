
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MapaMental() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock URL para o mapa mental - em uma implementação real, viria do banco
  const mapUrl = "https://www.mindmeister.com/map/123456";
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulação de atualização
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Mapa atualizado",
        description: "O seu mapa mental foi atualizado com sucesso."
      });
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meu Mapa Mental</CardTitle>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Este mapa mental representa sua jornada de aprendizado e desenvolvimento.
            Ele é atualizado pelo seu mentor para refletir seu progresso e áreas de foco.
          </p>
          
          <div className="aspect-video w-full border rounded-lg overflow-hidden">
            <iframe
              src={mapUrl} 
              width="100%"
              height="100%"
              title="Mind Meister Map"
              className="border-0"
            />
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Última atualização: 10/04/2025</p>
            <p>Atualizado por: João Silva (Mentor)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
