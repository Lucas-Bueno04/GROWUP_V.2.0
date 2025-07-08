
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2 } from "lucide-react";
import { Empresa } from "@/types/empresa-mentorado.types";
import { Badge } from "@/components/ui/badge";
import { formatCNPJ } from "@/types/empresa.types";

interface DetalhesEmpresaDialogProps {
  empresa: Empresa;
  trigger?: React.ReactNode;
}

export function DetalhesEmpresaDialog({ 
  empresa, 
  trigger 
}: DetalhesEmpresaDialogProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Detalhes</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {formatCNPJ(empresa.cnpj)}
          </DialogTitle>
          <DialogDescription>
            Detalhes da empresa
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Razão Social</p>
              <p className="font-medium">{empresa.razaoSocial}</p>
              
              <p className="text-sm text-muted-foreground mt-2">Nome Fantasia</p>
              <p className="font-medium">{empresa.nomeFantasia || "Não informado"}</p>
            </div>
            <Badge variant={empresa.situacao === "Ativa" ? "default" : "secondary"}>
              {empresa.situacao}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{empresa.telefone || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Setor</p>
              <p className="font-medium">{empresa.setor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Porte</p>
              <p className="font-medium">{empresa.porte}</p>
            </div>
          </div>
          
          {empresa.site && (
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <a 
                href={empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                {empresa.site}
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
