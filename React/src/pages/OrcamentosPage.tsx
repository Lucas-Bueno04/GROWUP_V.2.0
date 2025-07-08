
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useOrcamentoEmpresas, useOrcamentoEmpresasPorUsuario } from '@/hooks/useOrcamentoEmpresas';
import { OrcamentoEmpresaView } from '@/components/orcamento/OrcamentoEmpresaView';
import { OrcamentoMentorView } from '@/components/orcamento/OrcamentoMentorView';
import { OrcamentoStudentView } from '@/components/orcamento/OrcamentoStudentView';
import { OrcamentoErrorState } from '@/components/orcamento/OrcamentoErrorState';
import { OrcamentoLoadingState } from '@/components/orcamento/OrcamentoLoadingState';
import { useAuth } from '@/hooks/auth';

export default function OrcamentosPage() {
  console.log('=== ORCAMENTOS PAGE - INICIO ===');
  
  const { user } = useAuth();
  console.log('OrcamentosPage - user:', user?.email, 'role:', user?.role);
  
  const [selectedOrcamento, setSelectedOrcamento] = useState<string | null>(null);
  console.log('OrcamentosPage - selectedOrcamento:', selectedOrcamento);
  
  const isMentor = user?.role === 'mentor';
  console.log('OrcamentosPage - isMentor:', isMentor);

  // Use the appropriate hook based on user role
  const { 
    data: orcamentosMentor, 
    isLoading: loadingMentor, 
    error: errorMentor 
  } = useOrcamentoEmpresas();
  
  const { 
    data: orcamentosUsuario, 
    isLoading: loadingUsuario, 
    error: errorUsuario 
  } = useOrcamentoEmpresasPorUsuario();

  // Select the correct data based on user role
  const orcamentos = isMentor ? orcamentosMentor : orcamentosUsuario;
  const isLoading = isMentor ? loadingMentor : loadingUsuario;
  const error = isMentor ? errorMentor : errorUsuario;

  console.log('OrcamentosPage - dados finais:', {
    orcamentos: orcamentos?.length || 0,
    isLoading,
    error: error?.message,
    isMentor
  });

  const selectedOrcamentoData = selectedOrcamento 
    ? orcamentos?.find(o => o.id === selectedOrcamento)
    : null;
  
  console.log('OrcamentosPage - selectedOrcamentoData:', selectedOrcamentoData?.id);

  // Lidar com exclusão do orçamento
  const handleOrcamentoDeleted = () => {
    console.log('OrcamentosPage - Orçamento excluído, voltando para lista');
    setSelectedOrcamento(null);
  };

  if (selectedOrcamento && selectedOrcamentoData) {
    console.log('OrcamentosPage - Renderizando OrcamentoEmpresaView');
    return (
      <>
        <Helmet>
          <title>Orçamento - {selectedOrcamentoData.nome}</title>
        </Helmet>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedOrcamento(null)}
              className="mb-4"
            >
              ← Voltar para lista
            </Button>
          </div>
          <OrcamentoEmpresaView 
            orcamento={selectedOrcamentoData} 
            onOrcamentoDeleted={handleOrcamentoDeleted}
          />
        </div>
      </>
    );
  }

  console.log('OrcamentosPage - Renderizando conteúdo principal');

  return (
    <>
      <Helmet>
        <title>Orçamentos</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <Header 
          title="Orçamentos" 
          description="Gerencie orçamentos e acompanhe a performance financeira das empresas"
        />

        <div className="mt-6">
          {error ? (
            <OrcamentoErrorState error={error} />
          ) : isLoading ? (
            <OrcamentoLoadingState />
          ) : isMentor ? (
            <OrcamentoMentorView 
              orcamentos={orcamentos}
              onSelectOrcamento={setSelectedOrcamento}
            />
          ) : (
            <OrcamentoStudentView 
              orcamentos={orcamentos}
              onSelectOrcamento={setSelectedOrcamento}
            />
          )}
        </div>
      </div>
    </>
  );
}
