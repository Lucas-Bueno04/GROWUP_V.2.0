
-- Função para exclusão segura de orçamento empresa
CREATE OR REPLACE FUNCTION public.delete_orcamento_empresa_complete(
  p_orcamento_empresa_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
  orcamento_rec RECORD;
BEGIN
  -- Verificar se o orçamento existe e se o usuário tem permissão
  SELECT oe.*, e.nome as empresa_nome
  INTO orcamento_rec
  FROM public.orcamento_empresas oe
  INNER JOIN public.empresas e ON e.id = oe.empresa_id
  WHERE oe.id = p_orcamento_empresa_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Orçamento não encontrado ou sem permissão'
    );
  END IF;

  -- Log da operação de exclusão
  INSERT INTO public.audit_log (
    user_id, 
    action, 
    table_name, 
    record_id, 
    details
  ) VALUES (
    auth.uid(),
    'DELETE_ORCAMENTO_EMPRESA',
    'orcamento_empresas',
    p_orcamento_empresa_id,
    jsonb_build_object(
      'orcamento_nome', orcamento_rec.nome,
      'empresa_nome', orcamento_rec.empresa_nome,
      'ano', orcamento_rec.ano
    )
  );

  -- Excluir dados relacionados em cascata
  
  -- 1. Excluir valores do orçamento
  DELETE FROM public.orcamento_empresa_valores 
  WHERE orcamento_empresa_id = p_orcamento_empresa_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- 2. Excluir valores dos grupos
  DELETE FROM public.orcamento_empresa_grupos_valores 
  WHERE orcamento_empresa_id = p_orcamento_empresa_id;
  
  -- 3. Excluir metas vinculadas ao orçamento
  DELETE FROM public.metas_indicadores 
  WHERE vinculado_orcamento = true 
    AND empresa_id = orcamento_rec.empresa_id 
    AND ano = orcamento_rec.ano;
  
  DELETE FROM public.metas_indicadores_empresa 
  WHERE vinculado_orcamento = true 
    AND empresa_id = orcamento_rec.empresa_id 
    AND ano = orcamento_rec.ano;
  
  -- 4. Finalmente, excluir o orçamento principal
  DELETE FROM public.orcamento_empresas 
  WHERE id = p_orcamento_empresa_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Orçamento excluído com sucesso',
    'deleted_values_count', deleted_count,
    'orcamento_nome', orcamento_rec.nome
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', 'Erro interno: ' || SQLERRM
  );
END;
$$;

-- Criar tabela de auditoria se não existir
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Política para que apenas mentores vejam logs de auditoria
CREATE POLICY "Mentors can view audit logs" ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.is_mentor(auth.uid()));

-- Política para inserção de logs (qualquer usuário autenticado pode inserir seus próprios logs)
CREATE POLICY "Users can insert their own audit logs" ON public.audit_log
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
