import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { resetUserPassword, toggleUserBlock, deleteUser } from "@/lib/edge-functions-client";
import { UserTable } from "@/components/admin/UserTable";
import { UserDialogs } from "@/components/admin/UserDialogs";
import { DatabaseInstructions } from "@/components/admin/DatabaseInstructions";




export default function AdminAcessos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [blockUserDialogOpen, setBlockUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

 
  
  return (
    <div className="h-full">
      <div className="container mx-auto px-6 py-6">
        <Header
          title="Gestão de Acessos"
          description="Gerencie os acessos dos usuários ao sistema"
          colorScheme="yellow"
        />
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            </div>
            <UserTable 
            />
          </CardContent>
        </Card>

        {/* Mostrar instruções apenas se houver um erro */}
        {showInstructions && <DatabaseInstructions />}
      </div>
      
    </div>
  );
}
