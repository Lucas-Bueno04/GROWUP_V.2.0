import React, { createContext, useContext, useState, useEffect } from "react";
import  jwtDecode from "jwt-decode";

// Tipo customizado do seu token
type MyJwtPayload = {
  sub: string;
  roles: string[];
};

type AuthContextType = {
  user: { email: string; roles: string[] } | null;
  token: string | null;
  login: (jwtToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string; roles: string[] } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(savedToken);
        setUser({ email: decoded.sub, roles: decoded.roles });
        setToken(savedToken);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    const decoded = jwtDecode<MyJwtPayload>(jwtToken);
    setUser({ email: decoded.sub, roles: decoded.roles, });
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
