
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";



export function EmpresasSearch() {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar empresas..."
          className="pl-10"
        />
      </div>
    </div>
  );
}
