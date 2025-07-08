
import { useState } from "react";
import { UserX, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditarDependenteDialog } from "./EditarDependenteDialog";

interface Dependente {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  user_id: string | null;
}

interface DependentesListProps {
  dependentes: Dependente[];
  onDeleteDependente: (id: string) => void;
  onEditSuccess?: () => void;
}

export function DependentesList({ dependentes, onDeleteDependente, onEditSuccess }: DependentesListProps) {
  const [editingDependente, setEditingDependente] = useState<Dependente | null>(null);

  const getPermissionLevelLabel = (permissionLevel: string) => {
    switch (permissionLevel) {
      case "leitura":
        return "Leitura";
      case "escrita_basica":
        return "Escrita Básica";
      case "escrita_completa":
        return "Escrita Completa";
      case "admin":
        return "Admin";
      default:
        return "Desconhecido";
    }
  };

  const handleEditSuccess = () => {
    setEditingDependente(null);
    if (onEditSuccess) {
      onEditSuccess();
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dependentes.map((dependente) => (
              <TableRow key={dependente.id}>
                <TableCell className="font-medium">{dependente.nome}</TableCell>
                <TableCell>{dependente.email}</TableCell>
                <TableCell>{dependente.cargo || "N/A"}</TableCell>
                <TableCell>
                  <Badge>{getPermissionLevelLabel(dependente.permission_level)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDependente(dependente)}
                      className="text-blue-500 hover:text-white hover:bg-blue-500"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDependente(dependente.id)}
                      className="text-red-500 hover:text-white hover:bg-red-500"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingDependente && (
        <EditarDependenteDialog
          dependente={editingDependente}
          open={!!editingDependente}
          onOpenChange={(open) => !open && setEditingDependente(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
