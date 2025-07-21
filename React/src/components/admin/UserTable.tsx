import React, { useEffect, useState } from "react";
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
import { UserActions } from "./UserActions";
import { User } from "../interfaces/User";
import axios from "axios";
import { JwtService } from "@/components/auth/GetAuthParams";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getAll = async(token: string): Promise<User[]> => {
  const response = await axios.get(`${API_KEY}/users/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const deleteByEmail = async(email: string, token: string): Promise<void> => {
  await axios.delete(`${API_KEY}/users/delete/${email}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export function UserTable() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const token = jwtService.getToken();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const usersData = await getAll(token);
        setUsers(usersData);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [token]);

  // Função para deletar usuário e atualizar a lista
  async function onDelete(email: string) {
    if (!window.confirm(`Confirma a exclusão do usuário ${email}?`)) return;
    try {
      await deleteByEmail(email, token);
      setUsers((prev) => prev ? prev.filter(user => user.email !== email) : null);
    } catch (err) {
      alert("Erro ao deletar usuário.");
    }
  }

  // Funções vazias para os botões que não devem ter funcionalidade
  const onResetPassword = () => {};
  const onToggleBlock = () => {};

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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                <UserActions 
                  user={user}
                  onResetPassword={onResetPassword}
                  onToggleBlock={onToggleBlock}
                  onDelete={() => onDelete(user.email)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
