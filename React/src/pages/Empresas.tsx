
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useEmpresas } from "@/hooks/use-empresas";
import { NovaEmpresaAdminDialog } from "@/components/empresa/NovaEmpresaAdminDialog";
import { EmpresasSearch } from "@/components/empresa/EmpresasSearch";
import { EmpresasAguardandoSection } from "@/components/empresa/EmpresasAguardandoSection";
import { EmpresasAtivasSection } from "@/components/empresa/EmpresasAtivasSection";
import { useEmpresasFiltering } from "@/hooks/useEmpresasFiltering";
import { JwtService } from "@/components/auth/GetAuthParams";
import axios from 'axios';
import { findEmpresaByCNPJ } from "@/services/empresa-mentorado-operations.service";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();
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

const FindEnterprisesByEmail = async (email, token):Promise<Enterprise[]>=>{
  const response = await axios.get(`${API_KEY}/enterprise/${email}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data;
}


const Empresas = () => {
 
  const [enterprises, setEnterprises] = useState([]);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(()=>{
    setToken(jwtService.getToken());
    setEmail(jwtService.getClaim("sub"));
  },[])

  const loadEnterprises = async () =>{
    const data = await FindEnterprisesByEmail(email, token);
    setEnterprises(data);
  }

  useEffect(()=>{
    if(email&&token){
      loadEnterprises();
    }
  },[email, token]);

  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gerenciamento de Empresas"
          description="Gerencie empresas cadastradas no sistema"
          colorScheme="blue"
          actions={<NovaEmpresaAdminDialog />}
        />

        <div className="space-y-6">
          <EmpresasSearch 
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Empresas Cadastradas</h2>
            
            <EmpresasAtivasSection 
              empresas={enterprises}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empresas;
