
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const SidebarLogout = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="px-4 py-2 mt-auto">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100/40 dark:hover:bg-red-900/20"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
};
