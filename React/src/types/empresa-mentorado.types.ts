
// Types for the empresa-mentorado relationship

import { Empresa as BaseEmpresa, EmpresaDisplay, convertToEmpresaDisplay, EmpresaStatus } from "./empresa.types";

// Legacy interface maintained for backward compatibility
export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  setor?: string;
  porte?: string;
  telefone?: string;
  site?: string;
  situacao: string;
}

// Interface for solicitation of new company
export interface EmpresaSolicitacao {
  cnpj: string;
  nome_fantasia: string;
  mentoradoId: string;
  justificativa?: string;
}

// Converts from database model to display model for UI
export function empresaToEmpresaLegacy(empresa: BaseEmpresa): Empresa {
  return {
    id: empresa.id,
    cnpj: empresa.cnpj,
    razaoSocial: empresa.nome,
    nomeFantasia: empresa.nome_fantasia,
    setor: empresa.setor,
    porte: empresa.porte,
    telefone: empresa.telefone,
    site: empresa.site || '',
    situacao: getSituacaoFromStatus(empresa.status as EmpresaStatus),
  };
}

// Helper function to convert status to situacao display text
function getSituacaoFromStatus(status: EmpresaStatus | string): string {
  switch(status) {
    case 'ativo':
      return 'Ativa';
    case 'aguardando':
      return 'Aguardando';
    case 'recusado':
      return 'Recusada';
    case 'suspenso':
      return 'Suspensa';
    case 'inativo':
      return 'Inativa';
    default:
      return 'Desconhecida';
  }
}
