
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface CNPJResponse {
  razao_social: string;
  nome_fantasia: string; // This is what the API returns
  fantasia?: string;     // Adding this for compatibility
  cnpj: string;
  cnpj_tipo?: string;
  atividade_principal?: {
    codigo: string;
    descricao: string;
  };
  porte?: string;
  natureza_juridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  email?: string;
  telefone?: string;
  situacao?: string;
  data_situacao?: string;
  capital_social?: string;
}

export const useCNPJApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cnpjData, setCnpjData] = useState<CNPJResponse | null>(null);
  
  // Esta função buscará as informações do CNPJ
  const consultarCNPJ = async (cnpj: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Remover caracteres não numéricos do CNPJ
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ inválido. Deve conter 14 dígitos.');
      }
      
      // Buscar a chave da API no localStorage
      // No futuro, isso virá das configurações do sistema
      const apiKey = localStorage.getItem('CNPJ_WS_API_KEY');
      
      if (!apiKey) {
        throw new Error('Chave da API do CNPJ.ws não configurada. Acesse as configurações do sistema para configurá-la.');
      }
      
      // Montar a URL da API
      const url = `https://publica.cnpj.ws/cnpj/${cnpjLimpo}`;
      
      // Fazer a requisição para a API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Chave da API do CNPJ.ws inválida ou expirada.');
        } else if (response.status === 404) {
          throw new Error('CNPJ não encontrado.');
        } else if (response.status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
        } else {
          throw new Error(`Erro ao consultar CNPJ: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      // Garantir que os campos necessários existam no objeto retornado
      const formattedData: CNPJResponse = {
        razao_social: data.razao_social || 'Não disponível',
        nome_fantasia: data.nome_fantasia || '',
        fantasia: data.nome_fantasia || data.fantasia || '', // Compatibilidade com ambos os campos
        cnpj: data.cnpj || cnpjLimpo, // Usar cnpjLimpo como fallback
        atividade_principal: data.atividade_principal || { codigo: '', descricao: 'Não especificado' },
        porte: data.porte || 'Não especificado',
        telefone: data.telefone || 'Não informado',
        // Outros campos podem ser incluídos conforme necessário
      };
      
      setCnpjData(formattedData);
      setIsLoading(false);
      return formattedData;
      
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || 'Erro ao consultar CNPJ');
      toast({
        title: "Erro na consulta de CNPJ",
        description: error.message || 'Ocorreu um erro ao consultar o CNPJ',
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    consultarCNPJ,
    isLoading,
    error,
    cnpjData
  };
};
