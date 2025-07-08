
import { Database } from '@/types/database.types';

export type Empresa = Database['public']['Tables']['empresas']['Row'] & {
  regime_tributario?: string;
  regiao?: string;
};
export type EmpresaInsert = Database['public']['Tables']['empresas']['Insert'] & {
  regime_tributario?: string;
  regiao?: string;
};

export type EmpresaStatus = 'ativo' | 'aguardando' | 'inativo' | 'recusado' | 'suspenso';

// Interface padronizada para dados de empresa em formulários
export interface EmpresaFormData {
  nome: string;
  cnpj: string;         // CNPJ é o identificador único e principal
  nome_fantasia: string;
  setor: string;
  porte: string;
  telefone: string;
  site?: string;
  regime_tributario?: string;
  regiao?: string;
}

// Interface para apresentação consistente de empresa na UI
export interface EmpresaDisplay {
  id: string;           // Mantido para compatibilidade com o sistema atual
  cnpj: string;         // Identificador principal
  razaoSocial: string;  // Nome (razão social)
  nomeFantasia: string; // Nome fantasia
  setor?: string;
  porte?: string;
  telefone?: string;
  site?: string;
  situacao: string;
}

// Função auxiliar para converter entre os diferentes formatos de empresa
export function convertToEmpresaDisplay(empresa: Empresa): EmpresaDisplay {
  return {
    id: empresa.id,
    cnpj: empresa.cnpj,
    razaoSocial: empresa.nome,
    nomeFantasia: empresa.nome_fantasia,
    setor: empresa.setor,
    porte: empresa.porte,
    telefone: empresa.telefone,
    site: empresa.site || '',
    situacao: getSituacaoDisplay(empresa.status as EmpresaStatus)
  };
}

// Nova função auxiliar para obter o texto de situação a partir do status
function getSituacaoDisplay(status: EmpresaStatus): string {
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
    default:
      return 'Inativa';
  }
}

// Formato CNPJ: XX.XXX.XXX/XXXX-XX
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numericCNPJ = cnpj.replace(/\D/g, '');
  
  // Aplica máscara de formatação: XX.XXX.XXX/XXXX-XX
  return numericCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

// Remove formatação do CNPJ (converte para apenas números)
export function removeCNPJFormat(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

// Verifica se o CNPJ é válido (verificação básica de formato)
export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = removeCNPJFormat(cnpj);
  return cleanCNPJ.length === 14;
}
