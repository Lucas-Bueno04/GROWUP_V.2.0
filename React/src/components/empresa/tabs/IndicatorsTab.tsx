
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Indicator {
  nome: string;
  valor: string;
  tendencia: string;
}

interface IndicatorsTabProps {
  indicators: Indicator[];
}

export function IndicatorsTab({ indicators }: IndicatorsTabProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Indicadores da Empresa</h3>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Pencil size={16} />
          Editar Indicadores
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indicador</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Tendência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicators.map((indicator) => (
              <TableRow key={indicator.nome}>
                <TableCell className="font-medium">{indicator.nome}</TableCell>
                <TableCell>{indicator.valor}</TableCell>
                <TableCell>
                  {indicator.tendencia === "up" ? "↑" : indicator.tendencia === "down" ? "↓" : "→"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
