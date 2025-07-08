
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminEmpresas = () => {
  return (
    <div className="h-full">
      <Header
        title="Administração de Empresas"
        description="Gerencie todas as empresas registradas no sistema"
        actions={
          <Button className="bg-red-600 hover:bg-red-700">
            Nova Empresa
          </Button>
        }
      />

      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center py-8 text-muted-foreground">
              Esta página está em desenvolvimento e será implementada em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEmpresas;
