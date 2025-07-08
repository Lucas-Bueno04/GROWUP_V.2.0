
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Auth pages
import Login from '@/pages/auth/Login';

// Main pages
import Dashboard from '@/pages/Dashboard';
import Mentorado from '@/pages/Mentorado';
import MentorDashboard from '@/pages/MentorDashboard';

// Plan of accounts pages
import PlanoContasUnifiedPage from '@/pages/mentor/PlanoContasUnifiedPage';

// Budget pages
import OrcamentosPage from '@/pages/OrcamentosPage';

// Admin pages
import AdminAcessos from '@/pages/AdminAcessos';

// Company pages
import Empresas from '@/pages/Empresas';

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      {/* Main Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Profile */}
      <Route path="/mentorado" element={<Mentorado />} />
      
      {/* Plan of Accounts */}
      <Route path="/mentor/plano-contas/*" element={<PlanoContasUnifiedPage />} />
      
      {/* Budget Management */}
      <Route path="/orcamentos" element={<OrcamentosPage />} />
      
      {/* Companies */}
      <Route path="/empresas" element={<Empresas />} />
      
      {/* Mentor specific routes */}
      {user.role === 'mentor' && (
        <>
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/admin/acessos" element={<AdminAcessos />} />
        </>
      )}
      
      {/* Redirect any unknown routes to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
