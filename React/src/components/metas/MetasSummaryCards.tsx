
import { Card, CardContent } from "@/components/ui/card";
import { Target, Calculator, TrendingUp } from "lucide-react";

interface MetasSummaryCardsProps {
  totalMetas: number;
  indicadoresAtivos: number;
  metasIndicadoresCount: number;
  indicadoresPlanoContasCount: number;
}

export function MetasSummaryCards({
  totalMetas,
  indicadoresAtivos,
  metasIndicadoresCount,
  indicadoresPlanoContasCount
}: MetasSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Metas</p>
              <h3 className="text-2xl font-bold">{totalMetas}</h3>
            </div>
            <Target className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Indicadores Próprios</p>
              <h3 className="text-2xl font-bold">{indicadoresAtivos}</h3>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Metas dos Indicadores</p>
              <h3 className="text-2xl font-bold">{metasIndicadoresCount}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Indicadores Plano de Contas</p>
              <h3 className="text-2xl font-bold">{indicadoresPlanoContasCount}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
