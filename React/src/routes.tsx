
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import MentorGuard from '@/components/auth/MentorGuard';

const Mach1Dashboard = lazy(() => import('@/pages/conteudos/Mach1Dashboard'));
const PlanoContasUnifiedPage = lazy(() => import('@/pages/mentor/PlanoContasUnifiedPage'));
const OrcamentosPage = lazy(() => import('@/pages/OrcamentosPage'));
const CardsEstrategicos = lazy(() => import('@/pages/gestao/CardsEstrategicos'));
const AnaliseOrcamentaria = lazy(() => import('@/pages/gestao/AnaliseOrcamentaria'));
const Metas = lazy(() => import('@/pages/Metas'));
const RankingIndicadores = lazy(() => import('@/pages/gestao/RankingIndicadores'));
const PainelIndicadores = lazy(() => import('@/pages/mentor/PainelIndicadores'));

export function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard Principal */}
          <Route path="/dashboard" element={<AuthGuard><Mach1Dashboard /></AuthGuard>} />

          {/* Conteúdos Routes */}
          <Route path="/conteudos/mach1" element={<AuthGuard><Mach1Dashboard /></AuthGuard>} />

          {/* Mentor Routes */}
          <Route path="/mentor/plano-contas" element={<MentorGuard><PlanoContasUnifiedPage /></MentorGuard>} />

          {/* Admin Routes */}
          <Route path="/admin/painel-indicadores" element={<MentorGuard><PainelIndicadores /></MentorGuard>} />

          {/* Gestão Routes */}
          <Route path="/gestao" element={<AuthGuard><Navigate to="/gestao/cards-estrategicos" replace /></AuthGuard>} />
          <Route path="/gestao/orcamentos" element={<AuthGuard><OrcamentosPage /></AuthGuard>} />
          <Route path="/gestao/cards-estrategicos" element={<AuthGuard><CardsEstrategicos /></AuthGuard>} />
          <Route path="/gestao/ranking-indicadores" element={<AuthGuard><RankingIndicadores /></AuthGuard>} />
          <Route path="/gestao/analise-orcamentaria" element={<AuthGuard><AnaliseOrcamentaria /></AuthGuard>} />
          <Route path="/gestao/metas" element={<AuthGuard><Metas /></AuthGuard>} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
