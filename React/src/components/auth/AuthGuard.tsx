import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JwtService } from "@/components/auth/GetAuthParams";

interface AuthGuardProps {
  allowedRoles?: string[];
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const jwtService = new JwtService();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const valid = await jwtService.validateToken();
      setIsAuthenticated(valid);

      if (!valid) {
        jwtService.clearToken();
        navigate("/login");
        return;
      }

      const authorized = jwtService.hasRoles(allowedRoles);
      setIsAuthorized(authorized);

      if (!authorized) {
        navigate("/unauthorized");
      }
    }

    checkAuth();
  }, [jwtService, allowedRoles, navigate]);

  // Enquanto não sabe, evita renderizar conteúdo
  if (isAuthenticated === null || isAuthorized === null) {
    return null;
  }

  if (!isAuthenticated || !isAuthorized) {
    // Já navegou no useEffect
    return null;
  }

  return <>{children}</>;
};
