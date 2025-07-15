
import { ExternalLink } from "lucide-react";
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

interface InfoTabProps {
  empresa: Enterprise;
}

export function InfoTab({ empresa }: InfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Dados da Empresa</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Nome Fantasia</h3>
          <p className="text-base">{empresa.tradeName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Setor</h3>
          <p className="text-base">{empresa.sector}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Porte</h3>
          <p className="text-base">{empresa.size.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
          <p className="text-base">{empresa.phone}</p>
        </div>
      </div>
    </div>
  );
}
