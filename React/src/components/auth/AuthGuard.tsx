import React, { ReactNode, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { JwtService } from "@/components/auth/GetAuthParams";

interface AuthGuardProps {
  allowedRoles?: string[];
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const jwtService = useMemo(() => new JwtService(), []);

  const isAuthenticated = useMemo(() => jwtService.validateToken(), [jwtService]);
  const isAuthorized = useMemo(() => jwtService.hasRoles(allowedRoles), [jwtService, allowedRoles]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("token", null);
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/unauthorized");
    }
  }, [isAuthorized, navigate]);

  if (!isAuthenticated || !isAuthorized) {
    return null; // impede renderização prematura
  }

  return <>{children}</>;
};
