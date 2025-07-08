
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Simulação de dados do mentorado
const mockData = {
  nome: "Douglas Gomes Filho",
  email: "goga.filho@gmail.com",
  cpf: "122.736.088-61",
  telefone: "(11) 99765-5566",
  dataNascimento: "15/12/1970",
  endereco: "Rua Exemplo, 123",
  cidade: "São Paulo",
  estado: "SP",
  cep: "04123-789"
};

export function InfoMentorado() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(mockData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Não permitir alterações no campo CPF
    if (name === "cpf") return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Informações salvas",
      description: "Seus dados pessoais foram atualizados com sucesso!"
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Informações Pessoais</span>
          <Button 
            variant="outline" 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input 
              id="nome" 
              name="nome" 
              value={formData.nome}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input 
              id="cpf" 
              name="cpf" 
              value={formData.cpf}
              onChange={handleChange}
              disabled={true} // Sempre desabilitado, independente do modo de edição
              className="bg-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input 
              id="telefone" 
              name="telefone" 
              value={formData.telefone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input 
              id="dataNascimento" 
              name="dataNascimento" 
              value={formData.dataNascimento}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input 
              id="endereco" 
              name="endereco" 
              value={formData.endereco}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input 
              id="cidade" 
              name="cidade" 
              value={formData.cidade}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input 
              id="estado" 
              name="estado" 
              value={formData.estado}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input 
              id="cep" 
              name="cep" 
              value={formData.cep}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
