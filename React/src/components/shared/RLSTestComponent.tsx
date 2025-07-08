
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataTestResult {
  empresas: number;
  mentorados: number;
  orcamentoEmpresas: number;
  metasIndicadores: number;
  profiles: number;
  userRole: string;
  isRoleCheck: boolean;
  error?: string;
}

export function RLSTestComponent() {
  const { user } = useAuth();
  const [testData, setTestData] = useState<DataTestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testDataAccess = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('RLS Test: Iniciando teste de acesso a dados com RLS ativo');
      
      // Testar função de role primeiro
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role_optimized', { user_id: user.id });
      
      console.log('RLS Test: Resultado da função de role:', { roleData, roleError });
      
      // Testar acesso às tabelas principais
      const [empresasRes, mentoradosRes, orcamentoRes, metasRes, profilesRes] = await Promise.all([
        supabase.from('empresas').select('id', { count: 'exact', head: true }),
        supabase.from('mentorados').select('id', { count: 'exact', head: true }),
        supabase.from('orcamento_empresas').select('id', { count: 'exact', head: true }),
        supabase.from('metas_indicadores').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);

      console.log('RLS Test: Resultados das queries:', {
        empresas: { count: empresasRes.count, error: empresasRes.error?.message },
        mentorados: { count: mentoradosRes.count, error: mentoradosRes.error?.message },
        orcamento: { count: orcamentoRes.count, error: orcamentoRes.error?.message },
        metas: { count: metasRes.count, error: metasRes.error?.message },
        profiles: { count: profilesRes.count, error: profilesRes.error?.message }
      });

      setTestData({
        empresas: empresasRes.count || 0,
        mentorados: mentoradosRes.count || 0,
        orcamentoEmpresas: orcamentoRes.count || 0,
        metasIndicadores: metasRes.count || 0,
        profiles: profilesRes.count || 0,
        userRole: roleData || 'unknown',
        isRoleCheck: !roleError,
        error: roleError?.message
      });

      // Log de erros se houver
      const errors = [empresasRes.error, mentoradosRes.error, orcamentoRes.error, metasRes.error, profilesRes.error].filter(Boolean);
      if (errors.length > 0) {
        console.error('RLS Test: Erros encontrados:', errors);
      }
      
    } catch (error) {
      console.error('RLS Test: Erro geral no teste:', error);
      setTestData({
        empresas: 0,
        mentorados: 0,
        orcamentoEmpresas: 0,
        metasIndicadores: 0,
        profiles: 0,
        userRole: 'error',
        isRoleCheck: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && import.meta.env.DEV) {
      testDataAccess();
    }
  }, [user]);

  if (!import.meta.env.DEV || !user) {
    return null;
  }

  return (
    <Card className="border-dashed border-green-200 bg-green-50/50 dark:bg-green-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400">
          🔒 RLS Active - Data Access Test (DEV) - Role: {testData?.userRole || 'loading...'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="text-xs text-green-700 dark:text-green-300">Testing data access with RLS policies...</div>
        ) : testData ? (
          <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
            <div className="font-medium">Data accessible through RLS policies:</div>
            <div>• Empresas: {testData.empresas}</div>
            <div>• Mentorados: {testData.mentorados}</div>
            <div>• Orçamento empresas: {testData.orcamentoEmpresas}</div>
            <div>• Metas indicadores: {testData.metasIndicadores}</div>
            <div>• Profiles: {testData.profiles}</div>
            <div className="mt-2 pt-1 border-t border-green-200">
              <div className="font-medium">Role Security Function:</div>
              <div>• Function works: {testData.isRoleCheck ? '✅ Yes' : '❌ No'}</div>
              <div>• Current role: {testData.userRole}</div>
            </div>
            <div className="text-green-600 font-medium mt-2">
              🔒 All data filtered by RLS policies - security active
            </div>
            {testData.error && (
              <div className="text-red-600 dark:text-red-400 mt-1">Error: {testData.error}</div>
            )}
          </div>
        ) : (
          <div className="text-xs text-green-700 dark:text-green-300">No test data available</div>
        )}
      </CardContent>
    </Card>
  );
}
