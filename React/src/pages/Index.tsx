import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");

    // Simula carregamento e verifica token
    const token = localStorage.getItem("token");

    if (token) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }

    setLoading(false);
  }, [setTheme]);

  // Redireciona para dashboard se autenticado
  useEffect(() => {
    if (!loading && userAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, userAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <img
          src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png"
          alt="Grow Up Intelligence Logo"
          className="h-24 w-auto mb-6"
        />
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (userAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <img
          src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png"
          alt="Grow Up Intelligence Logo"
          className="h-24 w-auto mb-6"
        />
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, mostra tela inicial normal
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <img
        src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png"
        alt="Grow Up Intelligence Logo"
        className="h-24 w-auto mb-6"
      />
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Grow Up Intelligence</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A plataforma completa para gestão e crescimento da sua empresa
      </p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md"
        >
          Entrar
        </button>
        <button
          onClick={() => navigate("/register")}
          className="border border-input hover:bg-accent hover:text-accent-foreground px-6 py-2 rounded-md"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
