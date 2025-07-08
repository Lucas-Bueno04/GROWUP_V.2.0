import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  validateInput, 
  sanitizeInput, 
  cleanCNPJ, 
  formatCNPJ, 
  isValidCNPJ,
  checkRateLimit,
  logSecurityEvent,
  SAFE_ERROR_MESSAGES
} from '@/utils/security';
import { testApiKey, checkApiKeyStatus } from '@/lib/secure-storage';

export interface CNPJResponse {
  razao_social: string;
  nome_fantasia: string;
  fantasia?: string;
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

export const useSecureCNPJApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cnpjData, setCnpjData] = useState<CNPJResponse | null>(null);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  
  // Check if API is configured on hook initialization
  React.useEffect(() => {
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = async () => {
    try {
      const { configured } = await checkApiKeyStatus('CNPJ_WS');
      setApiConfigured(configured);
    } catch (error) {
      console.error('Error checking API configuration:', error);
      setApiConfigured(false);
    }
  };

  const consultarCNPJ = async (cnpj: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Input validation and sanitization
      const sanitizedCNPJ = sanitizeInput(cnpj);
      
      if (!isValidCNPJ(sanitizedCNPJ)) {
        throw new Error('CNPJ inválido. Deve conter 14 dígitos.');
      }
      
      const cnpjLimpo = cleanCNPJ(sanitizedCNPJ);
      
      // Rate limiting by CNPJ to prevent abuse
      const rateLimitKey = `cnpj_lookup_${cnpjLimpo}`;
      if (!checkRateLimit(rateLimitKey, 5, 60 * 1000)) { // 5 requests per minute per CNPJ
        throw new Error(SAFE_ERROR_MESSAGES.RATE_LIMITED);
      }
      
      // Check if API is configured
      const { configured } = await checkApiKeyStatus('CNPJ_WS');
      if (!configured) {
        throw new Error('API do CNPJ.ws não configurada. Acesse as configurações do sistema para configurá-la.');
      }
      
      logSecurityEvent('CNPJ_LOOKUP_ATTEMPT', { cnpj: cnpjLimpo });
      
      // Test the API key and get CNPJ data
      const { success, error: testError, testResult } = await testApiKey('CNPJ_WS', '');
      
      if (!success) {
        logSecurityEvent('CNPJ_LOOKUP_FAILED', { cnpj: cnpjLimpo, error: testError });
        throw new Error(testError || 'Erro ao consultar CNPJ. Verifique a configuração da API.');
      }
      
      if (!testResult || !testResult.razao_social) {
        throw new Error('CNPJ não encontrado ou dados inválidos retornados pela API.');
      }
      
      // Format and validate the response data
      const formattedData: CNPJResponse = {
        razao_social: sanitizeInput(testResult.razao_social || 'Não disponível'),
        nome_fantasia: sanitizeInput(testResult.nome_fantasia || ''),
        fantasia: sanitizeInput(testResult.nome_fantasia || testResult.fantasia || ''),
        cnpj: formatCNPJ(cnpjLimpo),
        atividade_principal: testResult.atividade_principal || { 
          codigo: '', 
          descricao: 'Não especificado' 
        },
        porte: sanitizeInput(testResult.porte || 'Não especificado'),
        telefone: sanitizeInput(testResult.telefone || 'Não informado'),
        natureza_juridica: sanitizeInput(testResult.natureza_juridica || ''),
        logradouro: sanitizeInput(testResult.logradouro || ''),
        numero: sanitizeInput(testResult.numero || ''),
        complemento: sanitizeInput(testResult.complemento || ''),
        cep: sanitizeInput(testResult.cep || ''),
        bairro: sanitizeInput(testResult.bairro || ''),
        municipio: sanitizeInput(testResult.municipio || ''),
        uf: sanitizeInput(testResult.uf || ''),
        email: testResult.email && validateInput(testResult.email, 'email') 
          ? testResult.email 
          : 'Não informado',
        situacao: sanitizeInput(testResult.situacao || ''),
        data_situacao: sanitizeInput(testResult.data_situacao || ''),
        capital_social: sanitizeInput(testResult.capital_social || '')
      };
      
      setCnpjData(formattedData);
      logSecurityEvent('CNPJ_LOOKUP_SUCCESS', { cnpj: cnpjLimpo });
      
      setIsLoading(false);
      return formattedData;
      
    } catch (error: any) {
      const errorMessage = error.message || SAFE_ERROR_MESSAGES.SERVER_ERROR;
      
      setIsLoading(false);
      setError(errorMessage);
      
      logSecurityEvent('CNPJ_LOOKUP_ERROR', { 
        cnpj: cnpj ? cleanCNPJ(sanitizeInput(cnpj)) : 'invalid',
        error: errorMessage 
      });
      
      toast({
        title: "Erro na consulta de CNPJ",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const testCNPJApi = async (apiKey: string) => {
    try {
      logSecurityEvent('CNPJ_API_TEST_ATTEMPT', {});
      
      const { success, error: testError, testResult } = await testApiKey('CNPJ_WS', apiKey);
      
      if (!success) {
        logSecurityEvent('CNPJ_API_TEST_FAILED', { error: testError });
        return { success: false, error: testError };
      }
      
      logSecurityEvent('CNPJ_API_TEST_SUCCESS', {});
      return { success: true, testResult };
      
    } catch (error) {
      console.error('Error testing CNPJ API:', error);
      logSecurityEvent('CNPJ_API_TEST_ERROR', { error });
      return { success: false, error: SAFE_ERROR_MESSAGES.SERVER_ERROR };
    }
  };
  
  return {
    consultarCNPJ,
    testCNPJApi,
    checkApiConfiguration,
    isLoading,
    error,
    cnpjData,
    apiConfigured
  };
};
