
import { EmpresaAtivaCard } from "./EmpresaAtivaCard";

interface EmpresasAtivasSectionProps {
  empresas: any[];
  isLoading: boolean;
}

export function EmpresasAtivasSection({ empresas, isLoading }: EmpresasAtivasSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Empresas Autorizadas</h3>
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : empresas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma empresa autorizada encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((empresa) => <EmpresaAtivaCard key={empresa.id} empresa={empresa} />)}
        </div>
      )}
    </div>
  );
}
