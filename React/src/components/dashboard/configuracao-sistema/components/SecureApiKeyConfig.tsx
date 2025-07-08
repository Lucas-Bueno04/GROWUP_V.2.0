
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Eye, 
  EyeOff, 
  TestTube, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertTriangle 
} from "lucide-react";
import { 
  storeApiKeySecurely, 
  testApiKey, 
  checkApiKeyStatus, 
  removeApiKey,
  API_CONFIGS 
} from "@/lib/secure-storage";
import { validateApiKey, logSecurityEvent } from "@/utils/security";
import { toast } from '@/components/ui/use-toast';

interface SecureApiKeyConfigProps {
  keyName: string;
  title: string;
  description: string;
  placeholder?: string;
}

type ApiStatus = 'not-configured' | 'configured' | 'testing' | 'error';

export function SecureApiKeyConfig({ 
  keyName, 
  title, 
  description, 
  placeholder = "Digite a chave da API..." 
}: SecureApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [status, setStatus] = useState<ApiStatus>('not-configured');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    checkCurrentStatus();
  }, [keyName]);

  const checkCurrentStatus = async () => {
    try {
      const { configured, error } = await checkApiKeyStatus(keyName);
      if (error) {
        setStatus('error');
        setError(error);
      } else {
        setStatus(configured ? 'configured' : 'not-configured');
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      setStatus('error');
      setError('Erro ao verificar status da API');
    }
  };

  const handleTestApi = async () => {
    if (!apiKey.trim()) {
      setError('Por favor, insira a chave da API antes de testar');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setError('Formato de chave API inválido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus('testing');

    try {
      logSecurityEvent('API_KEY_TEST_INITIATED', { keyName });

      const { success, error: testError, testResult: result } = await testApiKey(keyName, apiKey);

      if (success) {
        setTestResult(result);
        setStatus('configured');
        toast({
          title: "API testada com sucesso",
          description: `A chave da API ${title} está funcionando corretamente.`,
        });
      } else {
        setStatus('error');
        setError(testError || 'Erro ao testar a API');
        toast({
          title: "Erro no teste da API",
          description: testError || 'A chave da API não está funcionando',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing API:', error);
      setStatus('error');
      setError('Erro inesperado ao testar a API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApi = async () => {
    if (!apiKey.trim()) {
      setError('Por favor, insira a chave da API');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setError('Formato de chave API inválido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logSecurityEvent('API_KEY_SAVE_INITIATED', { keyName });

      // Test first, then save if successful
      const { success: testSuccess, error: testError } = await testApiKey(keyName, apiKey);
      
      if (!testSuccess) {
        setError(testError || 'Chave da API inválida');
        setIsLoading(false);
        return;
      }

      // Save the API key securely
      const { success, error: saveError } = await storeApiKeySecurely(keyName, apiKey);

      if (success) {
        setStatus('configured');
        setApiKey(''); // Clear the input for security
        toast({
          title: "API configurada com sucesso",
          description: `A chave da API ${title} foi salva com segurança.`,
        });
        await checkCurrentStatus(); // Refresh status
      } else {
        setError(saveError || 'Erro ao salvar a chave da API');
        toast({
          title: "Erro ao salvar API",
          description: saveError || 'Não foi possível salvar a chave da API',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setError('Erro inesperado ao salvar a chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      logSecurityEvent('API_KEY_REMOVAL_INITIATED', { keyName });

      const { success, error: removeError } = await removeApiKey(keyName);

      if (success) {
        setStatus('not-configured');
        setApiKey('');
        setTestResult(null);
        toast({
          title: "API removida com sucesso",
          description: `A configuração da API ${title} foi removida.`,
        });
      } else {
        setError(removeError || 'Erro ao remover a configuração da API');
      }
    } catch (error) {
      console.error('Error removing API key:', error);
      setError('Erro inesperado ao remover a API');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'configured':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Configurada</Badge>;
      case 'testing':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Testando</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Erro</Badge>;
      default:
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Não Configurada</Badge>;
    }
  };

  const config = API_CONFIGS[keyName];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {title}
          </div>
          {getStatusBadge()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {status !== 'configured' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`${keyName}-input`} className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Chave da API
              </Label>
              <div className="relative">
                <Input
                  id={`${keyName}-input`}
                  type={showApiKey ? "text" : "password"}
                  placeholder={placeholder}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="pr-10 font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={isLoading}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTestApi}
                disabled={!apiKey.trim() || isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {isLoading && status === 'testing' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="mr-2 h-4 w-4" />
                )}
                Testar API
              </Button>
              
              <Button
                onClick={handleSaveApi}
                disabled={!apiKey.trim() || isLoading}
                size="sm"
                className="flex-1"
              >
                {isLoading && status !== 'testing' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Salvar API
              </Button>
            </div>
          </div>
        )}

        {status === 'configured' && (
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                A API {config?.name || title} está configurada e funcionando corretamente.
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={handleRemoveApi}
              disabled={isLoading}
              variant="destructive"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Remover Configuração
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testResult && status === 'configured' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Último teste realizado com sucesso: {testResult.empresa || testResult.razao_social || 'Dados válidos retornados'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
