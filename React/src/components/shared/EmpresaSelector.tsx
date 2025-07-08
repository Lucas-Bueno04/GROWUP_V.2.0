
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from 'lucide-react';
import { useEmpresasOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import { useOrcamentoEmpresasPorUsuario } from '@/hooks/orcamento-empresas';
import { useAuth } from '@/hooks/useAuth';
import type { EmpresaOrcamento } from '@/hooks/analise-orcamentaria/useEmpresasOrcamento';
import type { OrcamentoEmpresa } from '@/hooks/orcamento-empresas/types';

interface EmpresaSelectorProps {
  empresaId: string | null;
  onEmpresaChange: (empresaId: string | null) => void;
  includeAllOption?: boolean;
  className?: string;
}

// Type guard to check if the item is OrcamentoEmpresa
function isOrcamentoEmpresa(item: EmpresaOrcamento | OrcamentoEmpresa): item is OrcamentoEmpresa {
  return 'empresa_id' in item && 'empresa' in item;
}

// Type guard to check if the item is EmpresaOrcamento
function isEmpresaOrcamento(item: EmpresaOrcamento | OrcamentoEmpresa): item is EmpresaOrcamento {
  return 'orcamentoId' in item && !('empresa_id' in item);
}

export function EmpresaSelector({ 
  empresaId, 
  onEmpresaChange, 
  includeAllOption = false,
  className 
}: EmpresaSelectorProps) {
  const { user } = useAuth();
  
  // Use appropriate hook based on user role
  const { data: empresasOrcamento = [], isLoading: isLoadingOrcamento } = useEmpresasOrcamento();
  const { data: orcamentosUsuario = [], isLoading: isLoadingUsuario } = useOrcamentoEmpresasPorUsuario();
  
  // Determine which data to use based on user role
  const isLoading = user?.role === 'mentor' ? isLoadingOrcamento : isLoadingUsuario;
  const empresasData = user?.role === 'mentor' ? empresasOrcamento : orcamentosUsuario;

  console.log('EmpresaSelector data:', {
    userRole: user?.role,
    empresasData: empresasData?.length || 0,
    isLoading,
    selectedEmpresaId: empresaId
  });

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className={`bg-black text-white border-gray-600 ${className}`}>
          <SelectValue placeholder="Carregando empresas..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (!empresasData || empresasData.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className={`bg-black text-white border-gray-600 ${className}`}>
          <SelectValue placeholder="Nenhuma empresa encontrada" />
        </SelectTrigger>
      </Select>
    );
  }

  // Get current selection display name using correct property names
  const getSelectedDisplayName = () => {
    if (!empresaId) return "Selecione uma empresa";
    
    if (user?.role === 'mentor') {
      // For mentors: empresasData contains EmpresaOrcamento objects
      const empresa = empresasData.find(e => isEmpresaOrcamento(e) && e.id === empresaId);
      return empresa && isEmpresaOrcamento(empresa) ? `${empresa.nomeFantasia || empresa.nome} (${empresa.ano})` : "Empresa não encontrada";
    } else {
      // For students: empresasData contains OrcamentoEmpresa objects
      const orcamento = empresasData.find(o => isOrcamentoEmpresa(o) && o.empresa_id === empresaId);
      return orcamento && isOrcamentoEmpresa(orcamento) && orcamento.empresa ? 
        `${orcamento.empresa.nome_fantasia || orcamento.empresa.nome} (${orcamento.ano})` : "Empresa não encontrada";
    }
  };

  return (
    <Select
      value={empresaId || (includeAllOption ? 'all' : '')}
      onValueChange={(value) => {
        console.log('EmpresaSelector onChange:', value);
        onEmpresaChange(value === 'all' ? null : value);
      }}
    >
      <SelectTrigger className={`bg-black text-white border-gray-600 ${className}`}>
        <SelectValue placeholder="Selecione uma empresa">
          {getSelectedDisplayName()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black text-white border-gray-600">
        {includeAllOption && (
          <SelectItem value="all" className="hover:bg-gray-800">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Todas as empresas</span>
            </div>
          </SelectItem>
        )}
        {empresasData.map((item) => {
          if (user?.role === 'mentor') {
            // For mentors: item is EmpresaOrcamento
            if (isEmpresaOrcamento(item)) {
              return (
                <SelectItem key={item.id} value={item.id} className="hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{item.nomeFantasia || item.nome} ({item.ano})</span>
                  </div>
                </SelectItem>
              );
            }
          } else {
            // For students: item is OrcamentoEmpresa with empresa_id and empresa properties
            if (isOrcamentoEmpresa(item)) {
              return (
                <SelectItem key={item.empresa_id} value={item.empresa_id} className="hover:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{item.empresa?.nome_fantasia || item.empresa?.nome || 'Empresa sem nome'} ({item.ano})</span>
                  </div>
                </SelectItem>
              );
            }
          }
          return null;
        })}
      </SelectContent>
    </Select>
  );
}
