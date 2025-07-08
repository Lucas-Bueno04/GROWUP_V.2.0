
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';

interface MetasDebugInfoProps {
  empresaId: string | null;
  isLoading: boolean;
  metasIndicadores: any;
  indicadoresEmpresa: any;
  metasIndicadoresEmpresa: any;
}

export function MetasDebugInfo({
  empresaId,
  isLoading,
  metasIndicadores,
  indicadoresEmpresa,
  metasIndicadoresEmpresa
}: MetasDebugInfoProps) {
  const { user } = useAuth();

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div><strong>User ID:</strong> {user?.id || 'Not logged in'}</div>
        <div><strong>Empresa Selecionada:</strong> {empresaId || 'Nenhuma empresa selecionada'}</div>
        <div><strong>Is Loading:</strong> {isLoading.toString()}</div>
        <div><strong>Metas Indicadores:</strong> Loading: {metasIndicadores.isLoading.toString()}, Error: {metasIndicadores.isError?.toString() || 'false'}, Count: {metasIndicadores.data?.length || 0}</div>
        <div><strong>Indicadores Empresa:</strong> Loading: {indicadoresEmpresa.isLoading.toString()}, Error: {indicadoresEmpresa.isError?.toString() || 'false'}, Count: {indicadoresEmpresa.data?.length || 0}</div>
        <div><strong>Metas Indicadores Empresa:</strong> Loading: {metasIndicadoresEmpresa.isLoading.toString()}, Error: {metasIndicadoresEmpresa.isError?.toString() || 'false'}, Count: {metasIndicadoresEmpresa.data?.length || 0}</div>
      </CardContent>
    </Card>
  );
}
