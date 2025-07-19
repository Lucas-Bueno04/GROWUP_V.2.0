
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { HelmetProvider } from "@/components/shared/HelmetProvider";
import { Layout } from "@/components/layout/Layout";
import { CardsEstrategicosPageContent } from '@/components/cards-estrategicos/CardsEstrategicosPageContent';

// Páginas públicas
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

// Páginas protegidas - Estudante
import Dashboard from "@/pages/Dashboard";
import Metas from "@/pages/Metas";
import Mentorado from "@/pages/Mentorado";
import Dependentes from "@/pages/Dependentes";
import Empresas from "@/pages/Empresas";
import OrcamentosPage from "@/pages/OrcamentosPage";
import CardsEstrategicos from "@/pages/gestao/CardsEstrategicos";
import AnaliseOrcamentaria from "@/pages/gestao/AnaliseOrcamentaria";

// Páginas de conteúdo
import AulasMensais from "@/pages/conteudos/AulasMensais";
import Cursos from "@/pages/conteudos/Cursos";
import GrowUp from "@/pages/conteudos/GrowUp";
import Mach1Dashboard from "@/pages/conteudos/Mach1Dashboard";

// Páginas do mentor
import MentorDashboard from "@/pages/MentorDashboard";
import Mentorados from "@/pages/Mentorados";
import MentoradoDetailPage from "@/pages/mentor/MentoradoDetailPage";
import GestaoCNPJ from "@/pages/GestaoCNPJ";
import AdminAcessos from "@/pages/AdminAcessos";
import ConfiguracaoSistema from "@/pages/ConfiguracaoSistema";
import PlanoContasUnifiedPage from "@/pages/mentor/PlanoContasUnifiedPage";
import PainelIndicadores from "@/pages/mentor/PainelIndicadores";
import { AuthGuard } from "./components/auth/AuthGuard";
import BudgetEditor from "./pages/BudgetComponent";

function App() {
  return (
    <Router>
      <HelmetProvider>
          <QueryProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  {/* Rotas protegidas - Básicas */}
                  <Route path="/dashboard" element={<AuthGuard><Layout><Dashboard /></Layout></AuthGuard>} />
                  <Route path="/metas" element={<AuthGuard><Layout><Metas /></Layout></AuthGuard>} />
                  <Route path="/mentorado" element={<AuthGuard><Layout><Mentorado /></Layout></AuthGuard>}/>
                  <Route path="/empresas" element={<AuthGuard><Layout><Empresas /></Layout></AuthGuard>}/>
                  <Route path="/orcamentos/:id" element={<AuthGuard><Layout><BudgetEditor /></Layout></AuthGuard>}/>
                  <Route path="/orcamentos" element={<AuthGuard><Layout><OrcamentosPage /></Layout></AuthGuard>} />
                  <Route path="/gestao/cards-estrategicos/:id" element={<AuthGuard><Layout><CardsEstrategicosPageContent /></Layout></AuthGuard>} />
                  <Route path="/gestao/cards-estrategicos" element={<AuthGuard><Layout><CardsEstrategicos /></Layout></AuthGuard>} />
                  <Route path="/gestao/analise-orcamentaria" element={<AuthGuard><Layout><AnaliseOrcamentaria/></Layout></AuthGuard>} />

                  {/* Rotas de conteúdo */}
                  <Route path="/conteudos/aulas-men sais" element={<AuthGuard><Layout><AulasMensais /></Layout></AuthGuard>} />
                  <Route path="/conteudos/cursos" element={<AuthGuard><Layout><Cursos /></Layout></AuthGuard>} />
                  <Route path="/conteudos/grow-up" element={<AuthGuard><Layout><GrowUp/></Layout></AuthGuard>} />
                  <Route path="/conteudos/mach1" element={<AuthGuard><Layout><Mach1Dashboard /></Layout></AuthGuard>} />

                  {/* Rotas do mentor - SOMENTE MENTORES */}
                  <Route path="/mentor" element={<AuthGuard><Layout><MentorDashboard/></Layout></AuthGuard>} />
                  <Route path="/mentor/plano-contas" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><PlanoContasUnifiedPage /></Layout></AuthGuard>} />
                  <Route path="/mentor/painel-indicadores" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><PainelIndicadores /></Layout></AuthGuard>} />
                  <Route path="/mentorados" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><Mentorados /></Layout></AuthGuard>} />
                  <Route path="/mentorados/:id" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><MentoradoDetailPage /></Layout></AuthGuard>} />
                  <Route path="/admin/cnpj" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><GestaoCNPJ /></Layout></AuthGuard>} />
                  <Route path="/admin/acessos" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><AdminAcessos /></Layout></AuthGuard>} />
                  <Route path="/configuracao" element={<AuthGuard allowedRoles={["ROLE_ADMINISTRATOR"]}><Layout><ConfiguracaoSistema /></Layout></AuthGuard>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
              </div>
            </ThemeProvider>
          </QueryProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
