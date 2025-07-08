
-- ===== LIMPEZA DE POLÍTICAS DUPLICADAS E CONFLITANTES =====

-- Remover todas as políticas existentes nas tabelas principais para recriar com consistência
DROP POLICY IF EXISTS "orcamento_empresas_access_optimized" ON public.orcamento_empresas;
DROP POLICY IF EXISTS "orcamento_empresa_valores_access_optimized" ON public.orcamento_empresa_valores;
DROP POLICY IF EXISTS "acesso_orcamento_empresas" ON public.orcamento_empresas;
DROP POLICY IF EXISTS "acesso_orcamento_valores" ON public.orcamento_empresa_valores;

-- ===== POLÍTICAS PARA ORCAMENTO_EMPRESAS =====

-- Política unificada para orcamento_empresas
CREATE POLICY "orcamento_empresas_unified_access" 
  ON public.orcamento_empresas 
  FOR ALL 
  USING (
    public.is_mentor_optimized(auth.uid()) OR 
    public.user_has_empresa_access(auth.uid(), empresa_id)
  );

-- ===== POLÍTICAS PARA ORCAMENTO_EMPRESA_VALORES =====

-- Política unificada para orcamento_empresa_valores
CREATE POLICY "orcamento_empresa_valores_unified_access" 
  ON public.orcamento_empresa_valores 
  FOR ALL 
  USING (
    public.is_mentor_optimized(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM public.orcamento_empresas oe 
      WHERE oe.id = orcamento_empresa_id 
      AND public.user_has_empresa_access(auth.uid(), oe.empresa_id)
    )
  );

-- ===== POLÍTICAS PARA TABELAS DE ESTRUTURA (READ-ONLY) =====

-- Habilitar RLS nas tabelas de estrutura
ALTER TABLE public.orcamento_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_indicadores ENABLE ROW LEVEL SECURITY;

-- Política para orcamento_grupos - acesso de leitura para todos os usuários autenticados
CREATE POLICY "orcamento_grupos_read_access" 
  ON public.orcamento_grupos 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para orcamento_contas - acesso de leitura para todos os usuários autenticados
CREATE POLICY "orcamento_contas_read_access" 
  ON public.orcamento_contas 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para orcamento_indicadores - acesso de leitura para todos os usuários autenticados
CREATE POLICY "orcamento_indicadores_read_access" 
  ON public.orcamento_indicadores 
  FOR SELECT 
  TO authenticated
  USING (true);

-- ===== POLÍTICAS DE ESCRITA PARA MENTORES =====

-- Mentores podem inserir/editar grupos
CREATE POLICY "orcamento_grupos_mentor_write" 
  ON public.orcamento_grupos 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_grupos_mentor_update" 
  ON public.orcamento_grupos 
  FOR UPDATE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_grupos_mentor_delete" 
  ON public.orcamento_grupos 
  FOR DELETE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

-- Mentores podem inserir/editar contas
CREATE POLICY "orcamento_contas_mentor_write" 
  ON public.orcamento_contas 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_contas_mentor_update" 
  ON public.orcamento_contas 
  FOR UPDATE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_contas_mentor_delete" 
  ON public.orcamento_contas 
  FOR DELETE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

-- Mentores podem inserir/editar indicadores
CREATE POLICY "orcamento_indicadores_mentor_write" 
  ON public.orcamento_indicadores 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_indicadores_mentor_update" 
  ON public.orcamento_indicadores 
  FOR UPDATE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

CREATE POLICY "orcamento_indicadores_mentor_delete" 
  ON public.orcamento_indicadores 
  FOR DELETE 
  TO authenticated
  USING (public.is_mentor_optimized(auth.uid()));

-- ===== CONFIRMAÇÃO DE RLS HABILITADO =====

-- Garantir que RLS está habilitado em todas as tabelas necessárias
ALTER TABLE public.orcamento_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_empresa_valores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_indicadores ENABLE ROW LEVEL SECURITY;
