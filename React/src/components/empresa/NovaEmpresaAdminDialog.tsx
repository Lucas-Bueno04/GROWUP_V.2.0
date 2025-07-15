import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useCNPJApi, CNPJResponse } from "@/hooks/use-cnpj-api";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import { JwtService } from "@/components/auth/GetAuthParams";
import { useNavigate } from "react-router-dom";


interface Size{
  name,
  minValue, 
  maxValue
}

interface Enterprise {
  id: number;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  phone: string;
  email: string;
  size: Size;
  sector: string;
  region: string;
  invoicing: number;
  taxRegime: string;
}

interface EnterpriseRequestDto {
  email: string;
  cnpj: string;
}

const jwtService = new JwtService();
const API_KEY = import.meta.env.VITE_SPRING_API;

const createEnterprise = async (
  requestData: EnterpriseRequestDto,
  token: string
): Promise<Enterprise> => {
  const response = await axios.post(`${API_KEY}/enterprise/create`, requestData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

interface OnCretedEnterpriseProps{
  onCreatedEnterprise?:()=>void;
}

export function NovaEmpresaAdminDialog({onCreatedEnterprise}) {
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState("");
  const [cnpjData, setCnpjData] = useState<CNPJResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { consultarCNPJ } = useCNPJApi();
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = jwtService.getClaim("sub");
    if (userEmail) setEmail(userEmail);
  }, []);

  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  const resetForm = () => {
    setCnpj("");
    setCnpjData(null);
  };

  const handleCNPJChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
      setCnpj(value);
    }
  };

  const handleCriarEmpresa = async () => {

    try {
      setIsLoading(true);
      const token = jwtService.getToken();
      await createEnterprise(
        {
          cnpj: cnpj,
          email: email,
        },
        token
      );

      toast({
        title: "Empresa cadastrada com sucesso",
      });

      resetForm();
      setOpen(false);
      if(onCreatedEnterprise){onCreatedEnterprise();} //reload

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar empresa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
          <Plus size={16} />
          Nova Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
          <DialogDescription>
            Digite o CNPJ da empresa para preenchimento automático.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cnpj">CNPJ da Empresa</Label>
            <Input
              id="cnpj"
              placeholder="XX.XXX.XXX/XXXX-XX"
              value={cnpj}
              onChange={handleCNPJChange}
              className="flex-1"
            />
          </div>

          {cnpjData && (
            <div className="grid gap-4 pt-2">
              <div className="grid gap-2">
                <Label>Razão Social</Label>
                <Input value={cnpjData.razao_social} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Nome Fantasia</Label>
                <Input value={cnpjData.nome_fantasia || cnpjData.razao_social} disabled />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleCriarEmpresa}
            className="bg-red-600 hover:bg-red-700"
          >
            Cadastrar empresa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
