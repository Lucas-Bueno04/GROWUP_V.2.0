
/**
 * Secure storage utilities for handling sensitive data like API keys
 */

import { supabase } from "@/lib/supabase";
import { logSecurityEvent, SAFE_ERROR_MESSAGES } from "@/utils/security";

export interface ApiKeyConfig {
  name: string;
  description: string;
  testEndpoint?: string;
  testMethod?: 'GET' | 'POST';
  testParams?: Record<string, any>;
}

// API configurations for different services
export const API_CONFIGS: Record<string, ApiKeyConfig> = {
  CNPJ_WS: {
    name: 'CNPJ.ws',
    description: 'API para consulta de dados de CNPJ',
    testEndpoint: 'https://publica.cnpj.ws/cnpj/33000167000101',
    testMethod: 'GET'
  }
};

/**
 * Securely stores API key using Supabase Edge Function
 */
export async function storeApiKeySecurely(keyName: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!keyName || !apiKey) {
      return { success: false, error: SAFE_ERROR_MESSAGES.INVALID_INPUT };
    }
    
    // Log security event
    logSecurityEvent('API_KEY_STORE_ATTEMPT', { keyName });
    
    // Call edge function to securely store the key
    const { data, error } = await supabase.functions.invoke('admin-operations', {
      body: {
        operation: 'storeApiKey',
        keyName,
        apiKey: apiKey.trim()
      }
    });
    
    if (error) {
      logSecurityEvent('API_KEY_STORE_FAILED', { keyName, error: error.message });
      return { success: false, error: SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    if (!data?.success) {
      return { success: false, error: data?.message || SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    logSecurityEvent('API_KEY_STORED_SUCCESSFULLY', { keyName });
    return { success: true };
    
  } catch (error) {
    console.error('Error storing API key:', error);
    logSecurityEvent('API_KEY_STORE_ERROR', { keyName, error });
    return { success: false, error: SAFE_ERROR_MESSAGES.SERVER_ERROR };
  }
}

/**
 * Tests an API key without storing it
 */
export async function testApiKey(keyName: string, apiKey: string): Promise<{ success: boolean; error?: string; testResult?: any }> {
  try {
    const config = API_CONFIGS[keyName];
    if (!config) {
      return { success: false, error: 'Configuração de API não encontrada' };
    }
    
    // Log security event
    logSecurityEvent('API_KEY_TEST_ATTEMPT', { keyName });
    
    // Call edge function to test the key
    const { data, error } = await supabase.functions.invoke('admin-operations', {
      body: {
        operation: 'testApiKey',
        keyName,
        apiKey: apiKey.trim(),
        config
      }
    });
    
    if (error) {
      logSecurityEvent('API_KEY_TEST_FAILED', { keyName, error: error.message });
      return { success: false, error: SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    if (!data?.success) {
      return { 
        success: false, 
        error: data?.message || 'Teste da API falhou',
        testResult: data?.testResult 
      };
    }
    
    logSecurityEvent('API_KEY_TEST_SUCCESS', { keyName });
    return { success: true, testResult: data.testResult };
    
  } catch (error) {
    console.error('Error testing API key:', error);
    logSecurityEvent('API_KEY_TEST_ERROR', { keyName, error });
    return { success: false, error: SAFE_ERROR_MESSAGES.SERVER_ERROR };
  }
}

/**
 * Checks if an API key is configured (without revealing the key)
 */
export async function checkApiKeyStatus(keyName: string): Promise<{ configured: boolean; error?: string }> {
  try {
    logSecurityEvent('API_KEY_STATUS_CHECK', { keyName });
    
    const { data, error } = await supabase.functions.invoke('admin-operations', {
      body: {
        operation: 'checkApiKeyStatus',
        keyName
      }
    });
    
    if (error) {
      console.error('Error checking API key status:', error);
      return { configured: false, error: SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    return { configured: data?.configured || false };
    
  } catch (error) {
    console.error('Error checking API key status:', error);
    return { configured: false, error: SAFE_ERROR_MESSAGES.SERVER_ERROR };
  }
}

/**
 * Removes an API key securely
 */
export async function removeApiKey(keyName: string): Promise<{ success: boolean; error?: string }> {
  try {
    logSecurityEvent('API_KEY_REMOVAL_ATTEMPT', { keyName });
    
    const { data, error } = await supabase.functions.invoke('admin-operations', {
      body: {
        operation: 'removeApiKey',
        keyName
      }
    });
    
    if (error) {
      logSecurityEvent('API_KEY_REMOVAL_FAILED', { keyName, error: error.message });
      return { success: false, error: SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    if (!data?.success) {
      return { success: false, error: data?.message || SAFE_ERROR_MESSAGES.OPERATION_FAILED };
    }
    
    logSecurityEvent('API_KEY_REMOVED_SUCCESSFULLY', { keyName });
    return { success: true };
    
  } catch (error) {
    console.error('Error removing API key:', error);
    logSecurityEvent('API_KEY_REMOVAL_ERROR', { keyName, error });
    return { success: false, error: SAFE_ERROR_MESSAGES.SERVER_ERROR };
  }
}
