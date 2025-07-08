
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function UnauthorizedPage() {
  const { refreshUserProfile, user, signOut } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      toast({
        title: "Atualizando perfil",
        description: "Aguarde enquanto atualizamos suas informações..."
      });
      
      await refreshUserProfile();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      // Redirect to dashboard after successful refresh
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "Não foi possível atualizar seu perfil. Tente fazer login novamente."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the signOut function
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          
          <h1 className="text-4xl font-bold">Acesso Negado</h1>
          <p className="text-gray-500">
            Você não tem permissão para acessar esta página.
          </p>
          
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-2">
              Sua função atual: <span className="font-semibold">{user?.role || "Não definido"}</span>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Se você acredita que deveria ter acesso, tente atualizar seu perfil ou fazer login novamente.
            </p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleRefresh} 
              className="gap-2" 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Atualizando..." : "Atualizar Perfil"}
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="gap-2"
              disabled={isRefreshing}
            >
              Sair e Fazer Login Novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
