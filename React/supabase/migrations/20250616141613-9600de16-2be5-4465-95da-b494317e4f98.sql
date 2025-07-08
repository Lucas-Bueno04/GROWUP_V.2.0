
-- Remove the classification_badges table and update the system to use faixas_faturamento

-- First, clean up existing badge awards to avoid foreign key conflicts
DELETE FROM public.company_badge_awards;

-- Drop the existing classification_badges table
DROP TABLE IF EXISTS public.classification_badges CASCADE;

-- Update company_badge_awards table to reference faixas_faturamento instead
ALTER TABLE public.company_badge_awards 
DROP CONSTRAINT IF EXISTS company_badge_awards_badge_id_fkey;

ALTER TABLE public.company_badge_awards 
ADD CONSTRAINT company_badge_awards_faixa_id_fkey 
FOREIGN KEY (badge_id) REFERENCES public.faixas_faturamento(id) ON DELETE CASCADE;

-- Rename badge_id column to faixa_id for clarity
ALTER TABLE public.company_badge_awards 
RENAME COLUMN badge_id TO faixa_id;

-- Update the classification function to use faixas_faturamento
CREATE OR REPLACE FUNCTION public.classificar_empresa_por_receita(p_empresa_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  receita_atual NUMERIC;
  receita_anterior NUMERIC;
  nova_classificacao TEXT;
  classificacao_anterior TEXT;
  faixa_rec RECORD;
  growth_percentage NUMERIC;
BEGIN
  -- Calculate current year revenue
  receita_atual := public.calcular_receita_atual_empresa(p_empresa_id);
  
  -- Get previous revenue from empresa
  SELECT faturamento_anual_anterior INTO receita_anterior
  FROM public.empresas
  WHERE id = p_empresa_id;
  
  receita_anterior := COALESCE(receita_anterior, 0);
  
  -- Get current classification from empresa_grupos
  SELECT grupo_valor INTO classificacao_anterior
  FROM public.empresa_grupos
  WHERE empresa_id = p_empresa_id AND grupo_tipo = 'faturamento'
  LIMIT 1;
  
  -- Determine new classification based on current revenue using faixas_faturamento
  SELECT nome INTO nova_classificacao
  FROM public.faixas_faturamento
  WHERE ativa = true 
    AND receita_atual >= valor_minimo 
    AND receita_atual <= valor_maximo
  ORDER BY ordem
  LIMIT 1;
  
  -- If no classification found, use the highest one
  IF nova_classificacao IS NULL THEN
    SELECT nome INTO nova_classificacao
    FROM public.faixas_faturamento
    WHERE ativa = true
    ORDER BY ordem DESC
    LIMIT 1;
  END IF;
  
  -- Update or insert classification in empresa_grupos
  INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
  VALUES (p_empresa_id, 'faturamento', nova_classificacao)
  ON CONFLICT (empresa_id, grupo_tipo) 
  DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();
  
  -- Calculate growth percentage
  IF receita_anterior > 0 THEN
    growth_percentage := ((receita_atual - receita_anterior) / receita_anterior) * 100;
  ELSE
    growth_percentage := NULL;
  END IF;
  
  -- Record classification history if there's a change
  IF classificacao_anterior IS NULL OR classificacao_anterior != nova_classificacao THEN
    INSERT INTO public.company_classification_history (
      empresa_id, previous_classification, new_classification, 
      previous_revenue, current_revenue, growth_percentage
    ) VALUES (
      p_empresa_id, classificacao_anterior, nova_classificacao,
      receita_anterior, receita_atual, growth_percentage
    );
    
    -- Award badge for new classification using faixas_faturamento
    SELECT * INTO faixa_rec 
    FROM public.faixas_faturamento 
    WHERE nome = nova_classificacao AND ativa = true;
    
    IF FOUND THEN
      INSERT INTO public.company_badge_awards (empresa_id, faixa_id)
      VALUES (p_empresa_id, faixa_rec.id)
      ON CONFLICT (empresa_id, faixa_id) DO NOTHING;
    END IF;
  END IF;
  
  -- Update empresa with new revenue data
  UPDATE public.empresas 
  SET faturamento_anual_anterior = receita_atual
  WHERE id = p_empresa_id;
END;
$$;

-- Update trigger to continue working
DROP TRIGGER IF EXISTS trigger_classify_company_on_budget_update ON public.orcamento_empresa_valores;
CREATE TRIGGER trigger_classify_company_on_budget_update
  AFTER INSERT OR UPDATE ON public.orcamento_empresa_valores
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_classificar_empresa();
