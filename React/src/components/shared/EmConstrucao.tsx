
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export interface EmConstrucaoProps {
  children?: React.ReactNode;
  titulo?: string;
}

const EmConstrucao: React.FC<EmConstrucaoProps> = ({ children, titulo }) => {
  // Use titulo prop if provided, otherwise use children
  const displayText = titulo || children;
  
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-xl">Em Construção</CardTitle>
          <CardDescription>Esta funcionalidade está sendo desenvolvida</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {displayText || "Estamos trabalhando para disponibilizar esta página em breve!"}
          </p>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Agradecemos sua paciência!
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmConstrucao;
