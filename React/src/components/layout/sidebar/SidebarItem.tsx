
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";


type SidebarItemProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
};

export const SidebarItem = ({
  to,
  icon: Icon,
  label,
  active,
  hasSubmenu,
  expanded,
  onClick,
  badge
}: SidebarItemProps) => {

  const location = useLocation();

  // Melhorar a lógica para evitar que múltiplos items sejam selecionados
  const isActive = active !== undefined ? active : (() => {
    // Verificação exata para evitar conflitos
    if (location.pathname === to) {
      return true;
    }
    
    // Para rotas que não são a home e mentor dashboard, verificar se começa com a rota
    if (to !== '/' && to !== '/mentor' && to !== '/dashboard') {
      return location.pathname.startsWith(`${to}/`);
    }
    
    // Para o dashboard do mentor, só ativar se for exatamente a rota
    if (to === '/mentor') {
      return location.pathname === '/mentor';
    }
    
    // Para o dashboard principal, só ativar se for exatamente a rota
    if (to === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    return false;
  })();

  

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors", 
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
      )} 
      onClick={onClick}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span className="flex-grow text-left">{label}</span>
      {badge}
      {hasSubmenu && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={cn(
            "transition-transform", 
            expanded ? "transform rotate-90" : ""
          )}
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      )}
    </Link>
  );
};
