
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { formatDate } from "@/utils/date-formatter";

// Define DependenteInfo type directly here, instead of importing from the hook
interface DependenteInfo {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  mentorado_id: string;
  mentorado_info?: {
    id: string;
    nome: string;
    email: string;
  };
  active: boolean;
  tipo_dependente: "mentoria" | "operacional";
}

interface DependenteCardProps {
  dependente: DependenteInfo;
  selectedPermission: string;
  onPermissionChange: (value: string) => void;
  processingId: string | null;
  onApprove: () => void;
  onReject: () => void;
}

export function DependenteCard({
  dependente,
  selectedPermission,
  onPermissionChange,
  processingId,
  onApprove,
  onReject
}: DependenteCardProps) {
  const isProcessing = processingId === dependente.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          {dependente.nome}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1">
            <span>{dependente.email}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Mentorado:</span>
            <span className="text-sm">{dependente.mentorado_info?.nome || 'Não disponível'}</span>
          </div>
          
          {dependente.cargo && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cargo:</span>
              <span className="text-sm">{dependente.cargo}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tipo:</span>
            <Badge variant={dependente.tipo_dependente === "mentoria" ? "default" : "secondary"}>
              {dependente.tipo_dependente === "mentoria" ? "Participante da Mentoria" : "Apenas Operacional"}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Solicitado em:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatDate(dependente.created_at)}</span>
            </div>
          </div>
          
          <div className="pt-3">
            <label className="block text-sm font-medium mb-1">Nível de Permissão:</label>
            <Select 
              value={selectedPermission} 
              onValueChange={onPermissionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um nível de permissão" />
              </SelectTrigger>
              <SelectContent>
                {dependente.tipo_dependente === "mentoria" ? (
                  <>
                    <SelectItem value="leitura">Somente Leitura</SelectItem>
                    <SelectItem value="escrita_basica">Escrita Básica</SelectItem>
                    <SelectItem value="escrita_completa">Escrita Completa</SelectItem>
                  </>
                ) : (
                  <SelectItem value="somente_operacional">Somente Operacional</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onReject}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          Rejeitar
        </Button>
        <Button
          className="w-full"
          onClick={onApprove}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Aprovar
        </Button>
      </CardFooter>
    </Card>
  );
}
