
import React from "react";
import { Clock, UserCheck, UserX } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PendingDependente {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  mentorado_id: string;
  active: boolean;
}

interface PendingDependentesListProps {
  pendingDependentes: PendingDependente[];
  isLoading: boolean;
  onApproveDependente: (id: string, permissionLevel: string) => void;
  onRejectDependente: (id: string) => void;
}

export function PendingDependentesList({ 
  pendingDependentes, 
  isLoading, 
  onApproveDependente, 
  onRejectDependente 
}: PendingDependentesListProps) {
  
  const getPermissionLevelLabel = (permissionLevel: string) => {
    switch (permissionLevel) {
      case "leitura": return "Leitura";
      case "escrita_basica": return "Escrita Básica";
      case "escrita_completa": return "Escrita Completa";
      case "admin": return "Admin";
      default: return "Desconhecido";
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Dependentes Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (pendingDependentes.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-amber-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-amber-500" />
          Dependentes Aguardando Aprovação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Nível de Permissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingDependentes.map((dependente) => (
              <TableRow key={dependente.id} className="bg-amber-50/50 dark:bg-amber-950/20">
                <TableCell className="font-medium">{dependente.nome}</TableCell>
                <TableCell>{dependente.email}</TableCell>
                <TableCell>{dependente.cargo || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getPermissionLevelLabel(dependente.permission_level)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApproveDependente(dependente.id, dependente.permission_level)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRejectDependente(dependente.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
