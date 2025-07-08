
import { useMemo } from "react";

interface Empresa {
  nome: string;
  cnpj: string;
  nome_fantasia: string;
}

export function useEmpresasFiltering(empresas: Empresa[] | undefined, searchTerm: string) {
  return useMemo(() => {
    if (!empresas) return [];
    
    return empresas.filter(
      (empresa) =>
        empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cnpj.includes(searchTerm) ||
        empresa.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empresas, searchTerm]);
}
