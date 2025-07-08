
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmpresasSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function EmpresasSearch({ searchTerm, onSearchChange }: EmpresasSearchProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
