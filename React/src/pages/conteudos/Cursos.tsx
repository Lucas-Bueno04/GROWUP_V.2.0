
import React from 'react';
import EmConstrucao from '@/components/shared/EmConstrucao';
import { Header } from '@/components/layout/Header';

const Cursos = () => {
  return (
    <>
      <Header
        title="Cursos"
        description="Acesse os cursos disponíveis no programa de mentoria"
      />
      <EmConstrucao>Cursos</EmConstrucao>
    </>
  );
};

export default Cursos;
