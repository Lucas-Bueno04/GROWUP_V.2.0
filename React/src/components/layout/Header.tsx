
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

type HeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  context?: {
    type: "mentorado" | "empresa" | "grupo";
    name: string;
    id: string;
  };
  badges?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    color?: string;
  }[];
  colorScheme?: "default" | "red" | "blue" | "green" | "yellow";
  customContent?: React.ReactNode;
};

export const Header = ({ 
  title, 
  description, 
  actions, 
  context, 
  badges,
  colorScheme = "default",
  customContent
}: HeaderProps) => {
  const { user } = useAuth();
  const isMentor = user?.role === "mentor";

  // Esquemas de cores para o cabeçalho
  const getColorClasses = () => {
    switch (colorScheme) {
      case "red":
        return "border-l-4 border-red-500 pl-4";
      case "blue":
        return "border-l-4 border-blue-500 pl-4";
      case "green":
        return "border-l-4 border-green-500 pl-4";
      case "yellow":
        return "border-l-4 border-yellow-500 pl-4";
      default:
        return "";
    }
  };

  return (
    <div className={`mb-6 ${getColorClasses()}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {context && (
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {context.type === "mentorado" ? "Mentorado" : 
                 context.type === "empresa" ? "Empresa" : "Grupo"}
              </Badge>
              <span className="text-sm text-muted-foreground">{context.name}</span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
          
          {customContent && (
            <div className="mt-2">
              {customContent}
            </div>
          )}
          
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {badges.map((badge, index) => {
                // Verificar se há uma cor personalizada
                const style = badge.color ? { backgroundColor: badge.color, color: '#fff' } : {};
                
                return (
                  <Badge 
                    key={index} 
                    variant={badge.variant || "default"}
                    className="text-xs"
                    style={style}
                  >
                    {badge.label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 mt-2 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
};
