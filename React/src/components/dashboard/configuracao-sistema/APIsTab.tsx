import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { SecureApiKeyConfig } from './components/SecureApiKeyConfig';

export function APIsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configuração Segura de APIs
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure chaves de API de forma segura para integração com serviços externos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <SecureApiKeyConfig
          keyName="CNPJ_WS"
          title="API CNPJ.ws"
          description="Configure a chave da API do CNPJ.ws para consultas automatizadas de dados empresariais."
          placeholder="Digite sua chave da API CNPJ.ws..."
        />
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Segurança:</strong> As chaves de API são armazenadas de forma criptografada e segura. 
            Nunca são expostas no frontend e são acessadas apenas por funções autorizadas no servidor.
          </AlertDescription>
        </Alert>

        {/* Placeholder para futuras APIs */}
        <div className="border rounded-lg p-4 opacity-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Outras APIs</h4>
              <p className="text-sm text-muted-foreground">
                Configurações para futuras integrações serão adicionadas aqui
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
