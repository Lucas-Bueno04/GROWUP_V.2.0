
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export const SidebarUserProfile = () => {
  const { user } = useAuth();
  
  // Get user initials from name or email
  const getInitials = () => {
    if (!user) return "GU";
    
    if (user.nome) {
      const parts = user.nome.split(' ');
      if (parts.length === 1) return parts[0].charAt(0);
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`;
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "GU";
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-red-800 to-red-950">
            <AvatarImage src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png" alt="Logo Grow Up Intelligence" />
            <AvatarFallback className="text-white font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Grow Up Intelligence</h2>
            <p className="text-sm text-sidebar-foreground/70">
              {user?.nome || user?.email || 'Bem-vindo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
