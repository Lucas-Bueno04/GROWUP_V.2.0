
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
import BudgetEditor from '@/pages/BudgetComponent';

export default function OrcamentosPage() {
  

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
        
        <BudgetEditor/>
      </div>
    </>
  );
}
