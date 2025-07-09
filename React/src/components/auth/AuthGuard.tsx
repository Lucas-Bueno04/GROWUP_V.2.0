
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type Role = 'aluno' | 'mentor';

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('AuthGuard: loading:', loading, 'user:', !!user, 'userRole:', user?.role, 'allowedRoles:', allowedRoles);

  // Mostrar loading enquanto carrega
  if (loading) {
    console.log('AuthGuard: Mostrando loading');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <img 
            src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png" 
            alt="Grow Up Intelligence Logo" 
            className="h-16 w-auto"
          />
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não tem usuário
  if (!user) {
    console.log('AuthGuard: Sem usuário, redirecionando para login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verificar permissões de role APENAS se especificado
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'aluno';
    console.log('AuthGuard: Verificando role - userRole:', userRole, 'allowedRoles:', allowedRoles);
    
    if (!allowedRoles.includes(userRole as Role)) {
      console.log('AuthGuard: Role não permitida, redirecionando para unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('AuthGuard: Acesso permitido para role:', user.role);
  return <>{children}</>;
};
