import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { JwtService } from "@/components/auth/GetAuthParams";


const API_KEY_USER = import.meta.env.VITE_SPRING_API_AUTH_ENDPOINT_REGISTER;

export const SidebarUserProfile = () => {

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

  // Gerar iniciais
  const getInitials = () => {
    const base = (name as string) || (email as string) || "";
    const parts = base.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-red-800 to-red-950">
            <AvatarImage src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png" alt="Logo Grow Up Intelligence" />
            <AvatarFallback className="text-white font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Grow Up Intelligence</h2>
            <p className="text-sm text-sidebar-foreground/70">
              {(name as string) || (email as string) || "Bem-vindo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
