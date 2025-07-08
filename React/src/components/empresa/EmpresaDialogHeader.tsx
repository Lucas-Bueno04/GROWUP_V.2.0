
import { Building2, Pencil } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditarEmpresaDialog } from "./EditarEmpresaDialog";
import { CompanyMedal } from "./CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";
import { Empresa } from "@/types/empresa.types";

interface EmpresaDialogHeaderProps {
  empresa: Empresa;
  onEmpresaAtualizada: () => void;
}

export function EmpresaDialogHeader({ empresa, onEmpresaAtualizada }: EmpresaDialogHeaderProps) {
  const { data: badgeData } = useCompanyBadge(empresa.id);

  const getCNPJFormatado = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {badgeData?.classification && (
            <CompanyMedal 
              classification={badgeData.classification} 
              currentRevenue={badgeData.currentRevenue}
              size="md" 
              showProgress={true}
            />
          )}
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">{empresa.nome}</DialogTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={empresa.status === "ativo" ? "default" : empresa.status === "aguardando" ? "outline" : "secondary"}>
            {empresa.status === "ativo" ? "Ativo" : empresa.status === "aguardando" ? "Aguardando" : "Inativo"}
          </Badge>
          <EditarEmpresaDialog 
            empresaId={empresa.id}
            empresaData={{
              nome: empresa.nome,
              nome_fantasia: empresa.nome_fantasia,
              cnpj: empresa.cnpj,
              setor: empresa.setor,
              porte: empresa.porte,
              telefone: empresa.telefone,
              site: empresa.site,
              regime_tributario: empresa.regime_tributario || 'Lucro Presumido',
              regiao: empresa.regiao || 'Sudeste'
            }}
            onSuccess={onEmpresaAtualizada}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Pencil size={16} />
                Editar
              </Button>
            }
          />
        </div>
      </div>
      <DialogDescription>
        <div>
          <p>CNPJ: {getCNPJFormatado(empresa.cnpj)}</p>
          <p>Nome Fantasia: {empresa.nome_fantasia || "Não informado"}</p>
        </div>
      </DialogDescription>
    </>
  );
}
