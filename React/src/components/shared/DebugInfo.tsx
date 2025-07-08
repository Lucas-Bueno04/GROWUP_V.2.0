
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface DebugInfoProps {
  show?: boolean;
}

export const DebugInfo = ({ show = true }: DebugInfoProps) => {
  const [pathInfo, setPathInfo] = useState('No route context');
  const [routeState, setRouteState] = useState<string>('null');
  const { user, loading } = useAuth();
  
  // Always declare hooks at the top level, even if they might not be used
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (location) {
      setPathInfo(location.pathname || 'unknown path');
      setRouteState(JSON.stringify(location.state) || 'null');
    }
  }, [location]);
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-auto max-w-[400px] bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg text-xs">
      <h3 className="font-semibold text-sm mb-2">Informações de Diagnóstico</h3>
      <ul className="space-y-1">
        <li><span className="font-semibold">Rota Atual:</span> {pathInfo}</li>
        <li><span className="font-semibold">Estado da Rota:</span> {routeState}</li>
        <li><span className="font-semibold">Auth Carregando:</span> {loading ? 'Sim' : 'Não'}</li>
        {user && (
          <>
            <li><span className="font-semibold">Usuário:</span> {user.email}</li>
            <li><span className="font-semibold">ID de Usuário:</span> {user.id}</li>
            <li><span className="font-semibold">Nome:</span> {user.nome || user.user_metadata?.nome || 'N/A'}</li>
            <li><span className="font-semibold">Role:</span> {user.role || 'N/A'}</li>
            <li><span className="font-semibold">Auth Status:</span> {user ? 'Autenticado' : 'Não Autenticado'}</li>
          </>
        )}
      </ul>
    </div>
  );
};
