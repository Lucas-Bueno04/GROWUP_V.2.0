
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useEmpresas } from "@/hooks/use-empresas";
import { NovaEmpresaAdminDialog } from "@/components/empresa/NovaEmpresaAdminDialog";
import { EmpresasSearch } from "@/components/empresa/EmpresasSearch";
import { EmpresasAguardandoSection } from "@/components/empresa/EmpresasAguardandoSection";
import { EmpresasAtivasSection } from "@/components/empresa/EmpresasAtivasSection";
import { useEmpresasFiltering } from "@/hooks/useEmpresasFiltering";

const Empresas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { empresasAguardando, empresasAtivas, isLoading } = useEmpresas();

  const filteredEmpresasAguardando = useEmpresasFiltering(empresasAguardando.data, searchTerm);
  const filteredEmpresasAtivas = useEmpresasFiltering(empresasAtivas.data, searchTerm);

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gerenciamento de Empresas"
          description="Gerencie empresas cadastradas no sistema"
          colorScheme="blue"
          actions={<NovaEmpresaAdminDialog />}
        />

        <div className="space-y-6">
          <EmpresasSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Empresas Cadastradas</h2>
            
            <EmpresasAguardandoSection 
              empresas={filteredEmpresasAguardando}
              isLoading={isLoading}
            />

            <EmpresasAtivasSection 
              empresas={filteredEmpresasAtivas}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empresas;
