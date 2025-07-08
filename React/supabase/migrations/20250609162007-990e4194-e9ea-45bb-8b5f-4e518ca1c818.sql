
-- Verificar e criar políticas RLS para a tabela metas_indicadores_empresa
ALTER TABLE public.metas_indicadores_empresa ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam suas próprias metas
CREATE POLICY "Users can view their own metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR SELECT 
  USING (auth.uid() = usuario_id);

-- Política para permitir que usuários criem suas próprias metas
CREATE POLICY "Users can create their own metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR INSERT 
  WITH CHECK (auth.uid() = usuario_id);

-- Política para permitir que usuários atualizem suas próprias metas
CREATE POLICY "Users can update their own metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR UPDATE 
  USING (auth.uid() = usuario_id);

-- Política para permitir que usuários excluam suas próprias metas
CREATE POLICY "Users can delete their own metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR DELETE 
  USING (auth.uid() = usuario_id);

-- Política adicional para mentores verem todas as metas
CREATE POLICY "Mentors can view all metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR SELECT 
  USING (public.is_mentor_optimized(auth.uid()));

-- Política adicional para mentores excluírem metas
CREATE POLICY "Mentors can delete all metas_indicadores_empresa" 
  ON public.metas_indicadores_empresa 
  FOR DELETE 
  USING (public.is_mentor_optimized(auth.uid()));
