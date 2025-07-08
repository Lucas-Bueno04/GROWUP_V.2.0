
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

export function EmpresasMentorado() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas do Mentorado
            </CardTitle>
            <CardDescription>
              Gerencie as empresas associadas a este mentorado.
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Associar Empresa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma empresa associada</p>
          <p className="text-sm mt-2">
            Associe empresas para permitir acesso aos dados financeiros
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
