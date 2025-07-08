
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Pencil } from "lucide-react";
import { EditarEmpresaDialog } from "./EditarEmpresaDialog";
import { DetalhesEmpresaCompleto } from "./DetalhesEmpresaCompleto";
import { RegistrarHistoricoDialog } from "./RegistrarHistoricoDialog";
import { CompanyMedal } from "./CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";

interface EmpresaAtivaCardProps {
  empresa: any;
}

export function EmpresaAtivaCard({ empresa }: EmpresaAtivaCardProps) {
  const { data: badgeData } = useCompanyBadge(empresa.id);

  return (
    <Card className="border border-slate-300 h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header with Badge and Company Name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            {badgeData?.classification ? (
              <CompanyMedal 
                classification={badgeData.classification} 
                currentRevenue={badgeData.currentRevenue}
                size="sm" 
                showProgress={false}
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg leading-tight mb-1">{empresa.nome_fantasia}</h4>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Ativa
            </Badge>
          </div>

          {/* Progress Section - Right aligned */}
          {badgeData?.classification && badgeData.nextLevel && (
            <div className="flex-shrink-0 text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Próximo nível:
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {badgeData.nextLevel}
              </div>
              {badgeData.nextThreshold && (
                <div className="text-xs text-muted-foreground">
                  {((badgeData.currentRevenue / badgeData.nextThreshold) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Company Details */}
        <div className="flex-1 space-y-1 text-sm text-muted-foreground mb-4">
          <p className="truncate">Razão Social: {empresa.nome}</p>
          <p>CNPJ: {empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</p>
          <p>Setor: {empresa.setor}</p>
          <p>Porte: {empresa.porte}</p>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
          <EditarEmpresaDialog 
            empresaId={empresa.id}
            empresaData={{
              nome: empresa.nome || '',
              nome_fantasia: empresa.nome_fantasia || '',
              cnpj: empresa.cnpj || '',
              setor: empresa.setor || '',
              porte: empresa.porte || '',
              telefone: empresa.telefone || '',
              site: empresa.site || '',
              regime_tributario: empresa.regime_tributario,
              regiao: empresa.regiao,
              faturamento_anual_anterior: empresa.faturamento_anual_anterior
            }}
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil size={14} className="mr-1" />
                Editar
              </Button>
            }
          />
          <DetalhesEmpresaCompleto
            empresaId={empresa.id}
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <FileText size={14} className="mr-1" />
                Detalhes
              </Button>
            }
          />
          <RegistrarHistoricoDialog
            empresaId={empresa.id}
            trigger={
              <Button variant="outline" size="sm" className="w-full">
                Histórico
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
