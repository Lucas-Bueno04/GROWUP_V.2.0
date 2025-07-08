
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const DiagnosticInfo = ({ show = false }) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Debug logs to verify component rendering
  console.log("DiagnosticInfo - rendering, show:", show);

  if (!show) return null;

  const navigateToRoute = (route: string) => {
    navigate(route);
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return "Erro ao formatar JSON";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
        <CardTitle className="text-sm flex justify-between items-center">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              {import.meta.env.DEV ? 'DEV' : 'PROD'}
            </Badge>
            Informações de Diagnóstico
          </div>
          {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CardTitle>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="text-xs">
          <ScrollArea className="h-48">
            <div className="space-y-2">
              <div>
                <strong>Rota Atual:</strong> {location.pathname}
              </div>
              <div>
                <strong>Estado da Rota:</strong> {JSON.stringify(location.state)}
              </div>
              <div>
                <strong>Auth Carregando:</strong> {loading ? "Sim" : "Não"}
              </div>
              <div>
                <strong>Usuário:</strong> {user ? user.email : 'Não autenticado'}
              </div>
              <div>
                <strong>ID de Usuário:</strong> {user?.id || 'N/A'}
              </div>
              <div>
                <strong>Nome:</strong> {user?.nome || 'N/A'}
              </div>
              <div>
                <strong>Role:</strong> {user?.role || 'N/A'}
              </div>
              <div>
                <strong>Auth Status:</strong> {session ? 'Autenticado' : 'Não Autenticado'}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="font-medium">Links Rápidos:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => navigateToRoute("/dashboard")}>Dashboard</Button>
                <Button size="sm" variant="outline" onClick={() => navigateToRoute("/mentor/dashboard")}>Dashboard Mentor</Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
};
