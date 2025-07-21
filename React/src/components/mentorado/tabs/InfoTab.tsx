import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { JwtService } from "@/components/auth/GetAuthParams";
import { User } from "@/components/interfaces/User";

const API_KEY = import.meta.env.VITE_SPRING_API;
const jwtService = new JwtService();

const getUserByEmail = async (email: string, token: string): Promise<User> => {
  const response = await axios.get(`${API_KEY}/users/by-email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateUser = async (user: User, token: string): Promise<void> => {
  await axios.put(`${API_KEY}/users/update`, user, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


const updatePassword = async (
  email: string,
  newPassword: string,
  token: string
): Promise<void> => {
  await axios.put(`${API_KEY}/users/update-password`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      email,
      newPassword
    }
  });
};

export function InfoTab() {
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = await jwtService.getToken();
      const email = await jwtService.getClaim("sub") as string;
      const userData = await getUserByEmail(email, token);
      setUser(userData);
      setEditableUser(userData);
    };
    fetchData();
  }, []);

  const handleInputChange = (field: keyof User, value: string) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editableUser || !user) return;
    const token = await jwtService.getToken();
    await updateUser(editableUser, token);
    setUser(editableUser);
    setIsEditing(false);
    alert("Informações atualizadas com sucesso!");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    const token = await jwtService.getToken();
    const email = await jwtService.getClaim("sub") as string;
    await updatePassword(email, newPassword, token);
    setNewPassword('');
    setConfirmPassword('');
    alert("Senha alterada com sucesso!");
  };

  if (!editableUser) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-6 bg-slate-800 text-white rounded-md">
        {/* Informações Pessoais */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input 
                value={editableUser.name} 
                readOnly={!isEditing}
                onChange={e => handleInputChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">CPF</Label>
              <Input 
                value={editableUser.cpf} 
                readOnly ={!isEditing}
                disabled ={!isEditing}
                onChange={e => handleInputChange("cpf", e.target.value)}
                className="bg-slate-700 border-slate-600 "
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input 
                value={editableUser.email} 
                readOnly 
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Telefone</Label>
              <Input 
                value={editableUser.phone} 
                readOnly={!isEditing}
                onChange={e => handleInputChange("phone", e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Data de Nascimento</Label>
              <Input 
                value={editableUser.birthDate} 
                readOnly={!isEditing}
                onChange={e => handleInputChange("birthDate", e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <Input 
                value="Ativo" 
                readOnly 
                className="bg-slate-700 border-slate-600 text-green-400 font-medium"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} variant="default">Salvar</Button>
                <Button onClick={() => { setIsEditing(false); setEditableUser(user); }} variant="secondary">Cancelar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">Editar</Button>
            )}
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nova Senha</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Confirmar Nova Senha</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handlePasswordChange} variant="default">Alterar Senha</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
