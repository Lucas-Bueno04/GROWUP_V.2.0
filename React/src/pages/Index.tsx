
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  
  console.log('Index: Rendering with loading:', loading, 'user:', !!user, 'userRole:', user?.role);
  
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  // Redirecionamento após carregamento
  useEffect(() => {
    console.log('Index: useEffect - loading:', loading, 'user:', !!user);
    
    if (!loading) {
      if (user) {
        console.log('Index: Redirecionando usuário logado para dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('Index: Usuário não logado, mostrando página inicial');
      }
    }
  }, [user, loading, navigate]);
  
  // Se está carregando
  if (loading) {
    console.log('Index: Mostrando loading');
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

  // Se tem usuário mas ainda não redirecionou
  if (user) {
    console.log('Index: Tem usuário, mostrando loading de redirecionamento');
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

  // Página inicial para usuários não autenticados
  console.log('Index: Mostrando página inicial');
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
