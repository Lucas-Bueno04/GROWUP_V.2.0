
import React, { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "ROLE_CUSTOMER" | "ROLE_ADMINISTRATOR";

type SidebarSectionProps = {
  title?: string | ReactNode;
  className?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
  requiredRoles?: Role[];
  checkActiveRole?: boolean;
};

export const SidebarSection = ({
  title,
  className,
  children,
  defaultCollapsed = false,
  requiredRoles,
  checkActiveRole = false
}: SidebarSectionProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const { user } = useAuth();

  // Verificar se o usuário tem permissão para ver esta seção
  const userRole = user?.role as Role | undefined;
  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    return null;
  }

  return (
    <div className="rounded-none mx-0">
      {title && (
        <div 
          className="flex items-center justify-between cursor-pointer px-3 mb-2" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 className="text-xs font-semibold text-muted-foreground">
            {title}
          </h3>
          {children && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform", 
                collapsed && "transform rotate-180"
              )} 
            />
          )}
        </div>
      )}
      <div className={cn("space-y-1", collapsed && "hidden")}>
        {children}
      </div>
    </div>
  );
};
