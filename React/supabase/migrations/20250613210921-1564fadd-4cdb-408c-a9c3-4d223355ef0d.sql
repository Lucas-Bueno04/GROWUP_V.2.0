
-- Remove the problematic RLS policies that directly query the profiles table
-- These are causing infinite recursion and access issues

-- Drop the problematic policy on orcamento_empresas
DROP POLICY IF EXISTS "acesso_orcamento_empresas" ON public.orcamento_empresas;

-- Drop the problematic policy on orcamento_empresa_valores  
DROP POLICY IF EXISTS "acesso_orcamento_valores" ON public.orcamento_empresa_valores;

-- Create simplified, optimized policies using security definer functions

-- Policy for orcamento_empresas using the optimized functions
CREATE POLICY "orcamento_empresas_access_optimized" 
  ON public.orcamento_empresas 
  FOR ALL 
  USING (
    public.is_mentor_optimized(auth.uid()) OR 
    public.user_has_empresa_access(auth.uid(), empresa_id)
  );

-- Policy for orcamento_empresa_valores using the optimized functions
CREATE POLICY "orcamento_empresa_valores_access_optimized" 
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

-- Ensure RLS is enabled on both tables
ALTER TABLE public.orcamento_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento_empresa_valores ENABLE ROW LEVEL SECURITY;
