
import { EmpresaAtivaCard } from "./EmpresaAtivaCard";


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

interface EmpresasAtivasSectionProps {
  empresas: Enterprise[];
}

export function EmpresasAtivasSection({ empresas }: EmpresasAtivasSectionProps) {
  return (
    <div className="space-y-4">
      {empresas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma empresa autorizada encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((empresa) => <EmpresaAtivaCard key={empresa.id} empresa={empresa} />)}
        </div>
      )}
    </div>
  );
}
