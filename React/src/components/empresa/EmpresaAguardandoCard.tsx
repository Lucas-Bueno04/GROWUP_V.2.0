
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Pencil } from "lucide-react";
import { EditarEmpresaDialog } from "./EditarEmpresaDialog";
import { DetalhesEmpresaCompleto } from "./DetalhesEmpresaCompleto";
import { CompanyMedal } from "./CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";

interface EmpresaAguardandoCardProps {
  empresa: any;
}

export function EmpresaAguardandoCard({ empresa }: EmpresaAguardandoCardProps) {
  const { data: badgeData } = useCompanyBadge(empresa.id);

  return (
    <Card className="border-orange-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Badge Section */}
          <div className="flex-shrink-0">
            {badgeData?.classification ? (
              <CompanyMedal 
                classification={badgeData.classification} 
                currentRevenue={badgeData.currentRevenue}
                size="sm" 
                showProgress={false}
                className="mb-2"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Company Info Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h4 className="font-bold text-lg leading-tight">{empresa.nome}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {empresa.nome_fantasia}
              </p>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>CNPJ: {empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</p>
              <p>Telefone: {empresa.telefone}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                Aguardando Autorização
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Solicitado por: {empresa.solicitado_por} em {empresa.data_solicitacao}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <EditarEmpresaDialog
              empresaId={empresa.id}
              empresaData={{
                nome: empresa.nome,
                nome_fantasia: empresa.nome_fantasia,
                cnpj: empresa.cnpj,
                setor: empresa.setor,
                porte: empresa.porte,
                telefone: empresa.telefone,
                site: empresa.site || '',
                regime_tributario: empresa.regime_tributario,
                regiao: empresa.regiao,
                faturamento_anual_anterior: empresa.faturamento_anual_anterior
              }}
              trigger={
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil size={16} className="mr-1" />
                  Editar
                </Button>
              }
            />
            <DetalhesEmpresaCompleto 
              empresaId={empresa.id}
              trigger={
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Detalhes
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
