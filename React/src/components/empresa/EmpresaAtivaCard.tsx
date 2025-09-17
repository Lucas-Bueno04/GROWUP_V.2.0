
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Pencil, Trash, Key ,EyeOff} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Baby, Footprints, TrendingUp, Crown, Landmark, Shield , Medal, Rocket, Gem} from "lucide-react";


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

interface InviteRequest{
  idEnterprise:number, 
  emailUser:string
}

interface EmpresaAtivaCardProps {
  empresa: Enterprise;
  onDeleteEnterprise?:()=>void;
}

const sizeIcons: Record<string, React.ElementType> = {
  Newborn: Medal,
  EarlyWalker: TrendingUp,
  Scaler: Rocket,
  Authority: Crown,
  Legacy: Landmark,
  Invencible: Gem,
};

const sizeColors: Record<string, string> = {
  Newborn: "text-pink-500",
  EarlyWalker: "text-orange-500",
  Scaler: "text-red-500",
  Authority: "text-purple-500",
  Legacy: "text-yellow-600",
  Invencible: "text-white-600",
};

function CompanySizeIcon({ size }: { size?: string }) {
  if (!size) return null;

  const Icon = sizeIcons[size] || Shield;
  const color = sizeColors[size] || "text-gray-400";
  return (
    <Icon
      className={`w-32 h-16 ml-3 inline-block ${color} drop-shadow-md`}
      strokeWidth={2.5} // ícones Lucide ficam mais robustos
    />
  );
}
const deleteEnterprise = async(id, token) :Promise<void>=>{
  const response = await axios.delete(`${API_ENDPOINT}/enterprise/delete/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const postInvite = async(data:InviteRequest, token:string):Promise<void>=>{
  const response = await axios.post(`${API_ENDPOINT}/enterprise_user/create`,data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const disableEnterpriseVisualisation = async(data:InviteRequest, token:string):Promise<void>=>{
  const response = await axios.delete(`${API_ENDPOINT}/enterprise_user/delete`,{
    data:data,
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

  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async () => {
    if(!inviteEmail || inviteEmail.trim() === ""){
      toast({title:"E-mail inválido",description:"Por favor, insira um e-mail válido para envio do convite.",variant:"destructive"});
      return;
    }

    try{
      const inviteData:InviteRequest = {
        idEnterprise:empresa.id,
        emailUser:inviteEmail
      }
      await postInvite(inviteData, token);
      toast({title:"Convite enviado",description:`Convite enviado com sucesso para ${inviteEmail}`});
      setInviteEmail("");
    }catch(error){
      console.error("Erro ao enviar convite:", error);
      toast({title:"Erro ao enviar convite",description:"Ocorreu um erro ao enviar o convite. Verifique o e-mail e tente novamente.",variant:"destructive"});
    }

  }

  const handleDisable = async(idEnterprise:number) => {
    try{
      const disableData:InviteRequest = {
        idEnterprise:idEnterprise,
        emailUser:jwtService.getClaim("sub") as string | null
      }
      await disableEnterpriseVisualisation(disableData, token);
      toast({title:"Empresa inabilitada",description:`A empresa ${empresa.tradeName || empresa.corporateName} foi inabilitada com sucesso.`});
      navigate(0);
    }
    catch(error){
      console.error("Erro ao inabilitar empresa:", error);
      toast({title:"Erro ao inabilitar empresa",description:"Ocorreu um erro ao inabilitar a empresa. Tente novamente.",variant:"destructive"});
    }
  }

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
          
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-lg leading-tight mb-1">{empresa.tradeName ||empresa.corporateName}</h4>
            <CompanySizeIcon size={empresa.size?.name} />
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="flex-1">
                <Key size={14} className="mr-1" />
                Acessos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Acessos da Empresa</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Input
                  type="email"
                  placeholder="Digite o e-mail para convite"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleInvite}>
                  Enviar
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => navigate(0)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="flex-1">
                <EyeOff size={14} className="mr-1" />
                Inabilitar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inabilitar Empresa</DialogTitle>
              </DialogHeader>
              <p>
                Deseja realmente inabilitar a visualização da empresa{" "}
                <strong>{empresa.tradeName || empresa.corporateName}</strong>?
              </p>
              <DialogFooter className="mt-4">
                <Button variant="outline">Cancelar</Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDisable(empresa.id)}
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </CardContent>
    </Card>
  );
}
