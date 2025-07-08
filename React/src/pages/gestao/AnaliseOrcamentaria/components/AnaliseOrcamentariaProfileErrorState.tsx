
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, User, LogOut, RefreshCw, Bug, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface AnaliseOrcamentariaProfileErrorStateProps {
  title: string;
  description: string;
  errorMessage?: string;
}

export function AnaliseOrcamentariaProfileErrorState({
  title,
  description,
  errorMessage
}: AnaliseOrcamentariaProfileErrorStateProps) {
  const { signOut, user, session } = useAuth();

  const handleRefresh = () => {
    console.log('AnaliseOrcamentariaProfileErrorState: Fazendo refresh da página');
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      console.log('AnaliseOrcamentariaProfileErrorState: Fazendo logout');
      await signOut();
    } catch (error) {
      console.error('AnaliseOrcamentariaProfileErrorState: Erro ao fazer logout:', error);
      window.location.href = '/';
    }
  };

  const handleClearCache = () => {
    console.log('AnaliseOrcamentariaProfileErrorState: Limpando cache local...');
    
    // Limpar localStorage relacionado a análise orçamentária
    const keysToRemove = [
      'selectedEmpresa',
      'lastSelectedEmpresa', 
      'analiseOrcamentaria',
      'empresasOrcamento'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Limpar todos os itens que contenham 'orcamento' ou 'empresa'
    Object.keys(localStorage).forEach(key => {
      if (key.includes('orcamento') || key.includes('empresa') || key.includes('analise')) {
        console.log('Removendo chave do localStorage:', key);
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('orcamento') || key.includes('empresa') || key.includes('analise')) {
        console.log('Removendo chave do sessionStorage:', key);
        sessionStorage.removeItem(key);
      }
    });
    
    alert('Cache local limpo! Clique em "Tentar Novamente" para recarregar.');
  };

  const handleDebugInfo = async () => {
    console.log('=== DEBUG INFO START ===');
    
    // Auth info
    console.log('AUTH STATE:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      hasSession: !!session,
      sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false,
      sessionExpiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null
    });
    
    // Test auth connection
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('SUPABASE SESSION TEST:', {
        success: !sessionError,
        hasSession: !!sessionData.session,
        error: sessionError?.message
      });
    } catch (error) {
      console.log('SUPABASE SESSION TEST ERROR:', error);
    }
    
    // Test database connection
    if (user?.id) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        console.log('PROFILE TEST:', {
          success: !profileError,
          hasProfile: !!profileData,
          profile: profileData,
          error: profileError?.message,
          errorCode: profileError?.code
        });
      } catch (error) {
        console.log('PROFILE TEST ERROR:', error);
      }
      
      // Test orcamento_empresas access
      try {
        const { data: orcamentoData, error: orcamentoError } = await supabase
          .from('orcamento_empresas')
          .select('id, ano, empresa:empresas(id, nome)')
          .eq('status', 'ativo')
          .limit(5);
          
        console.log('ORCAMENTO_EMPRESAS TEST:', {
          success: !orcamentoError,
          count: orcamentoData?.length || 0,
          data: orcamentoData?.map(o => ({
            id: o.id,
            ano: o.ano,
            empresa: o.empresa
          })),
          error: orcamentoError?.message,
          errorCode: orcamentoError?.code
        });
      } catch (error) {
        console.log('ORCAMENTO_EMPRESAS TEST ERROR:', error);
      }
    }
    
    // Check localStorage content
    console.log('LOCALSTORAGE CONTENT:', {
      orcamentoKeys: Object.keys(localStorage).filter(key => 
        key.includes('orcamento') || key.includes('empresa') || key.includes('analise')
      ).map(key => ({ key, value: localStorage.getItem(key) }))
    });
    
    console.log('=== DEBUG INFO END ===');
    alert('Informações de debug foram enviadas para o console. Abra as ferramentas de desenvolvedor (F12) para ver os detalhes.');
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-sm">
            {description}
          </p>
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-xs font-mono">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleClearCache} 
              className="w-full"
              variant="secondary"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Cache Local
            </Button>
            
            <Button 
              onClick={handleDebugInfo} 
              className="w-full"
              variant="secondary"
            >
              <Bug className="h-4 w-4 mr-2" />
              Gerar Info Debug
            </Button>
            
            <Button 
              onClick={handleRefresh} 
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={handleLogout} 
              className="w-full"
              variant="default"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Fazer Logout e Login
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Se o problema persistir, primeiro tente "Limpar Cache Local", depois use "Gerar Info Debug" e compartilhe as informações do console.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
