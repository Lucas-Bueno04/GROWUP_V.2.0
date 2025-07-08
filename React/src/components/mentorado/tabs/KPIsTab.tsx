
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type KPIsTabProps = {
  mentoradoId?: string;
};

export function KPIsTab({ mentoradoId }: KPIsTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Indicadores de Performance (KPIs)</h3>
        
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center bg-gray-100 rounded-full p-4 mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium mb-2">KPIs em desenvolvimento</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            Os indicadores de performance serão disponibilizados em breve.
            Aqui você poderá acompanhar métricas importantes sobre o desempenho do mentorado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
