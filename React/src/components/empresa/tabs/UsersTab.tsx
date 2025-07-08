
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UsersTabProps {
  mentorados: any[];
}

export function UsersTab({ mentorados }: UsersTabProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentorados.length > 0 ? (
            mentorados.map((mentorado: any) => (
              <TableRow key={mentorado.id}>
                <TableCell className="font-medium">{mentorado.nome}</TableCell>
                <TableCell>{mentorado.email}</TableCell>
                <TableCell>
                  <Badge variant={mentorado.status === "ativo" ? "default" : "secondary"}>
                    {mentorado.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Nenhum usuário vinculado a esta empresa
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
