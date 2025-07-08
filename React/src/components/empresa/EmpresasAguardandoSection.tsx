
import { EmpresaAguardandoCard } from "./EmpresaAguardandoCard";

interface EmpresasAguardandoSectionProps {
  empresas: any[];
  isLoading: boolean;
}

export function EmpresasAguardandoSection({ empresas, isLoading }: EmpresasAguardandoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Empresas Aguardando Autorização</h3>
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : empresas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma empresa aguardando autorização.</p>
      ) : (
        empresas.map((empresa) => <EmpresaAguardandoCard key={empresa.id} empresa={empresa} />)
      )}
    </div>
  );
}
