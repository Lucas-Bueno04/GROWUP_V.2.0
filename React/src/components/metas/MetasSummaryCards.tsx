
import { Card, CardContent } from "@/components/ui/card";
import { Target, Calculator, TrendingUp } from "lucide-react";


export function MetasSummaryCards({indicadoresProprios,IndicadoresPlanodeContas}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Indicadores Próprios</p>
              <h3 className="text-2xl font-bold">{indicadoresProprios}</h3>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>    
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Indicadores Plano de Contas</p>
              <h3 className="text-2xl font-bold">{IndicadoresPlanodeContas}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
