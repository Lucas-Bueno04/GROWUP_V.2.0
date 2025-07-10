
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Building2, Target } from "lucide-react";
import { JwtService } from "@/components/auth/GetAuthParams";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import axios from "axios";
import { error } from "console";

const API_KEY_USER = import.meta.env.VITE_SPRING_API_AUTH_ENDPOINT_REGISTER;

export const SimplifiedDashboard = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState<string|unknown>("");
  

  useEffect(() => {
    const jwtService = new JwtService();
    const emailFromToken = jwtService.getClaim("sub");
    setEmail(emailFromToken);
  }, []);

  useEffect(()=>{
      const jwtService = new JwtService();

      const fetchUserName = async ()=>{

      if (!email) return; 

      try{
        const response = await axios.get(`${API_KEY_USER}/name`,{
          params:{
            email:email
          },
          headers:{
            Authorization: `Bearer ${jwtService.getToken()}`
          }
        });
        setName(response.data);
      }catch(error){
        console.error("Erro ao buscar nome do usuario:", error);
      }
    };

    fetchUserName();
  },[email]);
  
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {(name as string) ||( (email as string)?.split('@')[0] || 'Usuário')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total de empresas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Metas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Metas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Indicadores de performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Usuários ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Dashboard em desenvolvimento. Em breve, você terá acesso a análises detalhadas e métricas de performance.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Cadastrar Empresa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="text-sm">Definir Metas</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Ver Relatórios</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
