
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { Mentorado } from "@/types/mentorado";
import { Badge } from "@/components/ui/badge";

type MentoradoListProps = {
  mentorados: Mentorado[];
  selectedMentorado: Mentorado | null;
  onSelectMentorado: (mentorado: Mentorado) => void;
  mentoradosWithPending?: Array<{ id: string; pendingCount: number }>;
};

export function MentoradoList({ 
  mentorados, 
  selectedMentorado, 
  onSelectMentorado,
  mentoradosWithPending = []
}: MentoradoListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Implementar filtragem real dos mentorados baseada no termo de busca
  const filteredMentorados = useMemo(() => {
    if (!searchTerm.trim()) return mentorados;
    
    return mentorados.filter(mentorado => 
      mentorado.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mentorado.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mentorados, searchTerm]);

  // Criar um mapa para encontrar rapidamente se um mentorado tem dependentes pendentes
  const pendingCountMap = useMemo(() => {
    const map = new Map<string, number>();
    
    // Log para depuração
    console.log("MentoradoList - mentoradosWithPending antes do mapeamento:", mentoradosWithPending);
    
    if (mentoradosWithPending && mentoradosWithPending.length > 0) {
      mentoradosWithPending.forEach(item => {
        if (item && item.id) {
          map.set(item.id, item.pendingCount || 0);
        }
      });
    }
    
    console.log("MentoradoList - pendingCountMap após mapeamento:", Array.from(map.entries()));
    return map;
  }, [mentoradosWithPending]);

  if (mentorados.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Mentorados</h2>
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            <p>Nenhum mentorado encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lista de Mentorados</h2>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mentorado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredMentorados.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-muted-foreground">
              <p>Nenhum resultado encontrado para "{searchTerm}"</p>
            </CardContent>
          </Card>
        ) : (
          filteredMentorados.map((mentorado) => {
            // Verificar se este mentorado tem dependentes pendentes
            const pendingCount = pendingCountMap.get(mentorado.id) || 0;
            const hasPending = pendingCount > 0;
            
            // Log detalhado para cada mentorado (debug)
            console.log(`Mentorado ${mentorado.nome} (${mentorado.id}):`, { pendingCount, hasPending });
            
            return (
              <Card 
                key={mentorado.id}
                className={`border-l-4 ${
                  mentorado.status === "ativo" ? "border-l-green-500" : "border-l-red-500"
                } cursor-pointer ${
                  hasPending ? "ring-2 ring-red-500" : ""
                } ${
                  selectedMentorado?.id === mentorado.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelectMentorado(mentorado)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <h4 className="font-medium flex items-center">
                          {mentorado.nome}
                          {hasPending && (
                            <span className="ml-2 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {mentorado.email}
                        </p>
                      </div>
                      {hasPending && (
                        <Badge className="ml-2 bg-red-600 text-white">
                          <Bell className="h-3 w-3 mr-1" />
                          {pendingCount}
                        </Badge>
                      )}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      mentorado.status === "ativo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {mentorado.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
