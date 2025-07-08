
import React from "react";
import { 
  BarChart3, 
  File, 
  Target, 
  User, 
  Building2, 
  School2, 
  Building, 
  Users, 
  Settings, 
  FileText,
  Layout,
  LineChart,
  Book,
  BookOpen,
  Compass,
  UserPlus,
  Calculator,
  PieChart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

export const SidebarNavigation = () => {
  const { user, loading } = useAuth();
  
  console.log('SidebarNavigation: loading:', loading, 'user:', !!user, 'userRole:', user?.role);
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Verificação de role
  const isMentor = user?.role === 'mentor';
  console.log('SidebarNavigation: isMentor:', isMentor, 'userRole:', user?.role);

  return (
    <>
      {/* Conteúdos - Para todos */}
      <SidebarSection title="CONTEÚDOS">
        <SidebarItem 
          to="/conteudos/aulas-mensais" 
          icon={Book}
          label="Aulas Mensais"
        />
        <SidebarItem 
          to="/conteudos/cursos" 
          icon={BookOpen}
          label="Cursos"
        />
        <SidebarItem 
          to="/conteudos/grow-up" 
          icon={Compass}
          label="Grow Up"
        />
        <SidebarItem 
          to="/conteudos/mach1" 
          icon={BarChart3}
          label="Mach1%"
        />
      </SidebarSection>

      {/* Gestão - Para todos */}
      <SidebarSection title="GESTÃO">
        <SidebarItem 
          to="/dashboard" 
          icon={BarChart3}
          label="Dashboard"
        />
        <SidebarItem 
          to="/gestao/cards-estrategicos" 
          icon={Layout}
          label="Cards Estratégicos"
        />
        <SidebarItem 
          to="/gestao/analise-orcamentaria" 
          icon={LineChart}
          label="Análise Orçamentária"
        />
      </SidebarSection>

      {/* Movimentação - Para todos */}
      <SidebarSection title="MOVIMENTAÇÃO">
        <SidebarItem 
          to="/orcamentos" 
          icon={Calculator}
          label="Orçamentos"
        />
        <SidebarItem 
          to="/metas" 
          icon={Target}
          label="Metas"
        />
      </SidebarSection>

      {/* Cadastros - Para todos */}
      <SidebarSection title="CADASTROS">
        <SidebarItem 
          to="/mentorado" 
          icon={User}
          label="Meu Perfil"
        />
        <SidebarItem 
          to="/dependentes" 
          icon={UserPlus}
          label="Dependentes"
        />
        <SidebarItem 
          to="/empresas" 
          icon={Building2}
          label="Empresas"
        />
      </SidebarSection>

      {/* ADMINISTRAÇÃO - SOMENTE MENTORES */}
      {isMentor && (
        <SidebarSection title="ADMINISTRAÇÃO">
          <SidebarItem 
            to="/mentor" 
            icon={BarChart3}
            label="Dashboard"
          />
          <SidebarItem 
            to="/mentor/painel-indicadores" 
            icon={PieChart}
            label="Painel de Indicadores"
          />
          <SidebarItem 
            to="/mentorados" 
            icon={School2}
            label="Gestão de Mentorados"
          />
          <SidebarItem 
            to="/admin/cnpj" 
            icon={Building}
            label="Gestão de CNPJ"
          />
          <SidebarItem 
            to="/admin/acessos" 
            icon={Users}
            label="Gestão de Acessos"
          />
          <SidebarItem 
            to="/configuracao" 
            icon={Settings}
            label="Configuração do Sistema"
          />
          <SidebarItem 
            to="/mentor/plano-contas" 
            icon={FileText}
            label="Plano de Contas"
          />
        </SidebarSection>
      )}
      
      {/* Debug info - remover após testes */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 mt-4 text-xs text-gray-500 border-t">
          <div>User Role: {user?.role || 'undefined'}</div>
          <div>Is Mentor: {isMentor ? 'Yes' : 'No'}</div>
        </div>
      )}
    </>
  );
};
