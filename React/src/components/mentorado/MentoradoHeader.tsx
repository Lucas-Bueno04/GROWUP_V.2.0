
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mentorado } from "@/types/mentorado";
import { CalendarDays, Mail, Phone, Building, TrashIcon, Edit } from "lucide-react";
import { useState } from "react";
import { DeleteMentoradoDialog } from "./DeleteMentoradoDialog";
import { EditarMentoradoDialog } from "./EditarMentoradoDialog";
import { useToast } from "@/components/ui/use-toast";

interface MentoradoHeaderProps {
  mentorado: Mentorado;
  onMentoradoDeleted?: () => void;
  onMentoradoUpdated?: () => void;
}

export function MentoradoHeader({ mentorado, onMentoradoDeleted, onMentoradoUpdated }: MentoradoHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleDeleteSuccess = () => {
    if (onMentoradoDeleted) {
      onMentoradoDeleted();
    }
  };

  const handleEditSuccess = () => {
    if (onMentoradoUpdated) {
      onMentoradoUpdated();
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{mentorado.nome}</h2>
            <div className="text-muted-foreground">ID: {mentorado.id}</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{mentorado.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{mentorado.telefone || "Não informado"}</span>
              </div>
              
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{mentorado.dataNascimento || "Não informado"}</span>
              </div>
              
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{mentorado.empresa || "Não informado"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-blue-500 hover:text-white hover:bg-blue-500"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <DeleteMentoradoDialog 
        mentorado={mentorado}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />

      <EditarMentoradoDialog
        mentorado={mentorado}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}
