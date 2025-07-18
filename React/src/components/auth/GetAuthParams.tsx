import jwt_decode from "jwt-decode";
import axios from "axios";

const API_ENDPOINT_VALIDATE = import.meta.env.VITE_SPRING_API_AUTH_ENDPOINT_LOGIN_VALIDATE;

type JwtPayload = {
  [key: string]: unknown; // permite acessar qualquer claim dinamicamente
};

export class JwtService {
  private tokenKey = "token"; // chave usada no localStorage para armazenar o token

  // Retorna o token completo armazenado no localStorage
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Retorna o payload decodificado do token atual
  private getDecodedPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwt_decode<JwtPayload>(token);
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  }

  // Retorna o valor de uma claim específica (como "sub", "roles", etc.)
  public getClaim(claimName: string): unknown | null {
    const payload = this.getDecodedPayload();
    return payload ? payload[claimName] ?? null : null;
  }

  // Verifica se o token atual possui uma ou mais roles específicas
  public hasRoles(requiredRoles?: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const rolesClaim = this.getClaim("roles");

    if (!Array.isArray(rolesClaim) || !rolesClaim.every((r) => typeof r === "string")) {
      return false;
    }

    const userRoles = rolesClaim as string[];
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  // Valida o token no backend (opcional)
  public async validateToken(): Promise<boolean> {
    try {
      const response = await axios.post(API_ENDPOINT_VALIDATE, {
        token: this.getToken(),
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao validar Token:", error);
      return false;
    }
  }

  // Armazena um novo token no localStorage
  public setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove o token (ex: logout)
  public clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
