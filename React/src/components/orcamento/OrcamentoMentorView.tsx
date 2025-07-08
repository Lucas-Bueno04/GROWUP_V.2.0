
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OrcamentoBudgetGrid } from './OrcamentoBudgetGrid';
import { OrcamentoEmptyState } from './OrcamentoEmptyState';
import { CriarOrcamentoDialog } from './CriarOrcamentoDialog';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface OrcamentoMentorViewProps {
  orcamentos?: OrcamentoEmpresa[];
  onSelectOrcamento: (id: string) => void;
}

export function OrcamentoMentorView({ orcamentos, onSelectOrcamento }: OrcamentoMentorViewProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('meus-orcamentos');

  const handleCreateSuccess = () => {
    // Retorna para a aba de orçamentos após criar
    setActiveTab('meus-orcamentos');
  };

  const handleCreateClick = () => {
    setShowCreateDialog(true);
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="meus-orcamentos">Meus Orçamentos</TabsTrigger>
          <TabsTrigger value="criar-orcamento">Criar Orçamento</TabsTrigger>
        </TabsList>

        <TabsContent value="meus-orcamentos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Orçamentos Disponíveis</h3>
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </div>
          
          {orcamentos && orcamentos.length > 0 ? (
            <OrcamentoBudgetGrid 
              orcamentos={orcamentos}
              onSelectOrcamento={onSelectOrcamento}
            />
          ) : (
            <OrcamentoEmptyState
              isMentor={true}
              title="Nenhum orçamento encontrado"
              description="Você ainda não criou orçamentos para empresas."
              showCreateButton={true}
              onCreateClick={handleCreateClick}
            />
          )}
        </TabsContent>

        <TabsContent value="criar-orcamento">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Plus className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Criar Novo Orçamento</h3>
                <p className="text-muted-foreground mb-6">
                  Configure um novo orçamento para uma empresa. Defina permissões e prazos de edição.
                </p>
                <Button onClick={handleCreateClick} size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CriarOrcamentoDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
