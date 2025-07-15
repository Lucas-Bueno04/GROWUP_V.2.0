
import { Building2, Pencil } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditarEmpresaDialog } from "./EditarEmpresaDialog";
import { CompanyMedal } from "./CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";
import { Empresa } from "@/types/empresa.types";


interface Size{
  name,
  minValue, 
  maxValue
}

interface Enterprise{
  id:number,
  cnpj:string,
  corporateName:string,
	tradeName:string,
	phone:string,
	email:string,
	size:Size,
	sector:string,
	region:string,
	invoicing:number,
  taxRegime:string
}


interface EmpresaDialogHeaderProps {
  empresa: Enterprise;
  onEmpresaAtualizada: () => void;
}

export function EmpresaDialogHeader({ empresa, onEmpresaAtualizada }: EmpresaDialogHeaderProps) {
  

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">{empresa.corporateName}</DialogTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditarEmpresaDialog 
            empresaId={empresa.id}
            empresaData={empresa}
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
          <p>CNPJ: {empresa.cnpj}</p>
          <p>Nome Fantasia: {empresa.tradeName || "Não informado"}</p>
        </div>
      </DialogDescription>
    </>
  );
}
