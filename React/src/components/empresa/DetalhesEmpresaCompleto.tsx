import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Empresa } from "@/types/empresa.types";
import { useToast } from "@/components/ui/use-toast";
import { useEmpresas } from "@/hooks/use-empresas";

// Import our new components
import { InfoTab } from "./tabs/InfoTab";
import { UsersTab } from "./tabs/UsersTab";
import { ClassificationTab } from "./tabs/ClassificationTab";
import { IndicatorsTab } from "./tabs/IndicatorsTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { EmpresaDialogHeader } from "./EmpresaDialogHeader";
import { EmpresaActionFooter } from "./EmpresaActionFooter";
interface Size{
  name,
  minValue, 
  maxValue
}

interface Enterprise{
  id:number,
  cnpj:string,
  corporateName:string,
	tradeName:string,
	phone:string,
	email:string,
	size:Size,
	sector:string,
	region:string,
	invoicing:number,
  taxRegime:string
}
interface DetalhesEmpresaCompletoProps {
  empresa:Enterprise;
  trigger?: React.ReactNode;
}

export function DetalhesEmpresaCompleto({ 
  empresa,
  trigger 
}: DetalhesEmpresaCompletoProps) {
  const [open, setOpen] = useState(false);
  const { autorizarEmpresa } = useEmpresas();
  const { toast } = useToast();

  function handleEmpresaAtualizada() {
  // Aqui você pode refetch os dados, emitir um toast, etc.
  toast({
    title: "Empresa atualizada com sucesso",
  });
}
  
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Visualizar</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {empresa ? (
          <>
            <DialogHeader>
              <EmpresaDialogHeader 
                empresa={empresa} 
                onEmpresaAtualizada={handleEmpresaAtualizada} 
              />
            </DialogHeader>
            
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="classification">Classificação</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <InfoTab empresa={empresa} />
              </TabsContent>
            
              <TabsContent value="classification">
              </TabsContent>
                
            </Tabs>
            
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado encontrado para esta empresa
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
