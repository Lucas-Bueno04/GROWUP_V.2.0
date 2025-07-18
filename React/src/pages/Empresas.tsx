import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { NovaEmpresaAdminDialog } from "@/components/empresa/NovaEmpresaAdminDialog";
import { EmpresasAtivasSection } from "@/components/empresa/EmpresasAtivasSection";
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from "axios";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

interface Size {
  name: string;
  minValue: number;
  maxValue: number;
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

const FindEnterprisesByEmail = async (
  email: string,
  token: string
): Promise<Enterprise[]> => {
  const response = await axios.get(`${API_KEY}/enterprise/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const Empresas = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  const loadEnterprises = async () => {
    const token = jwtService.getToken();
    const email = jwtService.getClaim("sub") as string;

    if (!token || !email) {
      console.warn("Token ou e-mail não disponível.");
      return;
    }

    try {
      const data = await FindEnterprisesByEmail(email, token);
      console.log("Empresas carregadas:", data);
      setEnterprises(data);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    }
  };

  useEffect(() => {
    loadEnterprises();
  }, []);

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gerenciamento de Empresas"
          description="Gerencie empresas cadastradas no sistema"
          colorScheme="blue"
          actions={<NovaEmpresaAdminDialog onCreatedEnterprise={loadEnterprises} />}
        />

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Empresas Cadastradas</h2>

            <EmpresasAtivasSection
              empresas={enterprises}
              onDeleteEnterprises={loadEnterprises}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empresas;
