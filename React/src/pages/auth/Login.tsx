import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL = import.meta.env.VITE_SPRING_API_AUTH_ENDPOINT_LOGIN as string;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Debug: verificar URL
      console.log("API URL:", API_URL);
      
      // Preparar dados exatamente como solicitado
      const requestBody = {
        "email": email,
        "password": password
      };
      
      

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Status da resposta:", response.status);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        // Tratar diferentes tipos de erro
        let errorMessage = "Erro ao realizar login.";
        
        if (response.status === 403) {
          errorMessage = "Acesso negado.";
        } else if (response.status === 401) {
          errorMessage = "Email ou senha incorretos.";
        } else if (response.status === 404) {
          errorMessage = "Endpoint não encontrado. Verifique a URL da API.";
        }

        // Tentar obter mensagem de erro do servidor
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Erro ao processar resposta JSON:", jsonError);
          // Se não conseguir fazer parse do JSON, usar mensagem padrão
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { token } = data;

      if (!token) {
        throw new Error("Token não retornado pelo servidor.");
      }

      localStorage.setItem("token", token)
      navigate("/dashboard");
      
    } catch (error: unknown) {
      console.error("Erro no login:", error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Erro desconhecido ao realizar login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="absolute top-3 right-3 z-10">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4">
            <img
              src="/lovable-uploads/cdb73704-6c5f-42cb-b887-9a5dd982fdb2.png"
              alt="Grow Up Intelligence Logo"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}