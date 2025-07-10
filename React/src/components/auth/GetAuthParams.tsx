import jwt_decode from "jwt-decode";
import axios from "axios";
import { CatIcon } from "lucide-react";

const API_ENDPOINT_VALIDATE = import.meta.env.VITE_SPRING_API_AUTH_ENDPOINT_LOGIN_VALIDATE;

type JwtPayload = {
  [key: string]: unknown; // para aceitar qualquer campo dinâmico
};

export class JwtService {
  private tokenKey = "token"; // chave usada no localStorage para armazenar o token
  private payload: JwtPayload | null = null;

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        this.payload = jwt_decode<JwtPayload>(token);
      } catch (error) {
        console.error("Token inválido:", error);
        this.payload = null;
      }
    }
  }

  // Método para pegar qualquer informação do payload pelo nome da chave
  public getClaim(claimName: string): unknown | null {
    if (!this.payload) return null;
    return this.payload[claimName] ?? null;
  }

  // Método para pegar o token completo (opcional)
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public hasRoles(requiredRoles?: string[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;

  const rolesClaim = this.getClaim("roles");

  if (!Array.isArray(rolesClaim) || !rolesClaim.every(r => typeof r === "string")) {
    return false;
  }

  const userRoles = rolesClaim as string[];

  return requiredRoles.some(role => userRoles.includes(role));
}

  public async validateToken() {

    try{
      const response = await axios.post(API_ENDPOINT_VALIDATE,{
        token:this.getToken()
      })

      return response.data;

    }catch(error){
      console.error("Erro ao validar Token:", error);
      return false
    }
    
  }
}
