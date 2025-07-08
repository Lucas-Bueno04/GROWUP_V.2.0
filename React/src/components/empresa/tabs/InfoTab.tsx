
import { ExternalLink } from "lucide-react";
import { Empresa } from "@/types/empresa.types";

interface InfoTabProps {
  empresa: Empresa;
}

export function InfoTab({ empresa }: InfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Dados da Empresa</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Nome Fantasia</h3>
          <p className="text-base">{empresa.nome_fantasia}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Setor</h3>
          <p className="text-base">{empresa.setor}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Porte</h3>
          <p className="text-base">{empresa.porte}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
          <p className="text-base">{empresa.telefone}</p>
        </div>
        {empresa.site && (
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
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
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">Data de Solicitação</h3>
          <p className="text-base">{empresa.data_solicitacao}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">Solicitado por</h3>
          <p className="text-base">{empresa.solicitado_por}</p>
        </div>
      </div>
    </div>
  );
}
