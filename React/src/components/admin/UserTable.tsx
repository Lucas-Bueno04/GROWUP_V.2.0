
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/pages/AdminAcessos";
import { UserActions } from "./UserActions";

interface UserTableProps {
  users: UserProfile[] | null;
  isLoading: boolean;
  error: Error | null;
  onResetPassword: (user: UserProfile) => void;
  onToggleBlock: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export function UserTable({
  users,
  isLoading,
  error,
  onResetPassword,
  onToggleBlock,
  onDelete
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
        <p className="font-semibold">Erro ao carregar usuários: {error.message}</p>
        <p className="mt-2 text-sm">
          Verifique se a função get_all_profiles existe no banco de dados ou se você tem permissões adequadas.
        </p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Cadastro</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'mentor' ? 'default' : 'outline'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_blocked ? 'destructive' : 'default'}>
                  {user.is_blocked ? 'Bloqueado' : 'Ativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                {user.last_sign_in_at ? 
                  new Date(user.last_sign_in_at).toLocaleDateString() : 
                  'Não disponível'}
              </TableCell>
              <TableCell className="text-right">
                <UserActions 
                  user={user}
                  onResetPassword={onResetPassword}
                  onToggleBlock={onToggleBlock}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
