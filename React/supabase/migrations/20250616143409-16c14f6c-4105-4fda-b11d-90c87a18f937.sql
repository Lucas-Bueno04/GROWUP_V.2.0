
-- Add faturamento_anual_anterior column to empresas table if it doesn't exist
-- (It already exists according to the schema, so this is safe)

-- Clean up any inconsistent entries in empresa_grupos table
-- Remove duplicate entries and ensure consistent classification types
DELETE FROM public.empresa_grupos 
WHERE id NOT IN (
  SELECT DISTINCT ON (empresa_id, grupo_tipo) id
  FROM public.empresa_grupos
  ORDER BY empresa_id, grupo_tipo, updated_at DESC
);

-- Ensure all active companies have proper classifications
-- First, ensure all companies have porte classification
INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT e.id, 'porte', e.porte
FROM public.empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM public.empresa_grupos eg 
  WHERE eg.empresa_id = e.id AND eg.grupo_tipo = 'porte'
)
ON CONFLICT (empresa_id, grupo_tipo) DO NOTHING;

-- Ensure all companies have setor classification
INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT e.id, 'setor', e.setor
FROM public.empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM public.empresa_grupos eg 
  WHERE eg.empresa_id = e.id AND eg.grupo_tipo = 'setor'
)
ON CONFLICT (empresa_id, grupo_tipo) DO NOTHING;

-- Ensure all companies have faturamento classification based on faixas_faturamento
INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT e.id, 'faturamento', 
  COALESCE(
    (SELECT ff.nome 
     FROM public.faixas_faturamento ff 
     WHERE ff.ativa = true 
       AND COALESCE(e.faturamento_anual_anterior, 0) >= ff.valor_minimo 
       AND COALESCE(e.faturamento_anual_anterior, 0) <= ff.valor_maximo
     ORDER BY ff.ordem 
     LIMIT 1),
    (SELECT ff.nome 
     FROM public.faixas_faturamento ff 
     WHERE ff.ativa = true 
     ORDER BY ff.ordem 
     LIMIT 1)
  )
FROM public.empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM public.empresa_grupos eg 
  WHERE eg.empresa_id = e.id AND eg.grupo_tipo = 'faturamento'
)
ON CONFLICT (empresa_id, grupo_tipo) DO NOTHING;

-- Update the company classification function to ensure it works with faixas_faturamento
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
