
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Pencil, Trash } from "lucide-react";
import { EditarEmpresaDialog } from "./EditarEmpresaDialog";
import { DetalhesEmpresaCompleto } from "./DetalhesEmpresaCompleto";
import { RegistrarHistoricoDialog } from "./RegistrarHistoricoDialog";
import { CompanyMedal } from "./CompanyMedal";
import { useCompanyBadge } from "@/hooks/useCompanyBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { toast } from "sonner";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from "react-router-dom";

const API_ENDPOINT = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService()



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

interface EmpresaAtivaCardProps {
  empresa: Enterprise;
  onDeleteEnterprise?:()=>void;
}

const deleteEnterprise = async(id, token) :Promise<void>=>{
  const response = await axios.delete(`${API_ENDPOINT}/enterprise/delete/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function EmpresaAtivaCard({ empresa,onDeleteEnterprise }: EmpresaAtivaCardProps) {

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [token , setToken] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(()=>{
    setToken(jwtService.getToken());
  },[])


  const handleDelete = async () => {
  
    try{
      await deleteEnterprise(empresa.id, token);
      toast({title:"Empresa excluida",description:"Empresa excluida com sucesso"});
      setOpenDeleteDialog(false);
      if(onDeleteEnterprise){
        onDeleteEnterprise();
      }
      
    }catch(error){
      console.error("Erro ao excluir empresa:", error);
    }
    
  };
  

  return (
    <Card className="border border-slate-300 h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header with Badge and Company Name */}
        <div className="flex items-start gap-3 mb-4">
          {/*
          <div className="flex-shrink-0">
            {badgeData?.classification ? (
              <CompanyMedal 
                classification={badgeData.classification} 
                currentRevenue={badgeData.currentRevenue}
                size="sm" 
                showProgress={false}
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>*/}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-lg leading-tight mb-1">{empresa.tradeName ||empresa.corporateName}</h4>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              Ativa
            </Badge>
          </div>
          
  

        </div>


        <div className="flex-1 space-y-1 text-sm text-muted-foreground mb-4">
          <p className="truncate">Razão Social: {empresa.corporateName}</p>
          <p>CNPJ: {empresa.cnpj}</p>
          <p>Atividade: {empresa.sector}</p>
          <p>Porte: {empresa.size?.name??""}</p>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
          <EditarEmpresaDialog 
            empresaData={empresa}
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil size={14} className="mr-1" />
                Editar
              </Button>
            }
          />
          <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1">
                <Trash size={14} className="mr-1" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir a empresa <strong>{empresa.tradeName || empresa.corporateName}</strong>?</p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={()=>handleDelete()}>
                  Confirmar Exclusão
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
