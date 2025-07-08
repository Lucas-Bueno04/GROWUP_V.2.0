
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MetasIndicadoresTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Indicador</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Período</TableHead>
        <TableHead>Meta</TableHead>
        <TableHead>Tendência</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
