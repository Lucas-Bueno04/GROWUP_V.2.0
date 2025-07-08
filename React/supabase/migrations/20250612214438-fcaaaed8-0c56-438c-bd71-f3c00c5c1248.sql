
-- Fix the calcular_indicador_empresa function to properly process formulas
CREATE OR REPLACE FUNCTION public.calcular_indicador_empresa(
  p_empresa_id UUID,
  p_indicador_codigo TEXT,
  p_formula TEXT,
  p_ano INTEGER,
  p_mes_ate INTEGER DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
  formula_processada TEXT;
  resultado NUMERIC := 0;
  valor_conta NUMERIC;
  valor_grupo NUMERIC;
  conta_codigo TEXT;
  grupo_codigo TEXT;
  mes_final INTEGER;
  orcamento_empresa_id UUID;
BEGIN
  -- Determinar até que mês calcular
  mes_final := COALESCE(p_mes_ate, 12);
  
  -- Buscar o ID do orçamento da empresa
  SELECT id INTO orcamento_empresa_id
  FROM public.orcamento_empresas
  WHERE empresa_id = p_empresa_id AND ano = p_ano AND status = 'ativo'
  LIMIT 1;
  
  IF orcamento_empresa_id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Processar fórmula para substituir referências
  formula_processada := p_formula;
  
  -- Processar referências de grupos G{número}
  WHILE formula_processada ~ 'G\d+' LOOP
    -- Extrair o primeiro código de grupo encontrado
    SELECT substring(formula_processada from 'G(\d+)') INTO grupo_codigo;
    
    -- Calcular valor do grupo
    SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO valor_grupo
    FROM public.orcamento_empresa_valores oev
    INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
    INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
    WHERE oev.orcamento_empresa_id = orcamento_empresa_id
      AND og.codigo = grupo_codigo
      AND oev.mes BETWEEN 1 AND mes_final;
    
    -- Substituir na fórmula
    formula_processada := regexp_replace(formula_processada, 'G' || grupo_codigo, valor_grupo::TEXT, 'g');
  END LOOP;
  
  -- Processar referências de contas C.{código}
  WHILE formula_processada ~ 'C\.[0-9\.]+' LOOP
    -- Extrair o primeiro código de conta encontrado
    SELECT substring(formula_processada from 'C\.([0-9\.]+)') INTO conta_codigo;
    
    -- Buscar valor acumulado da conta até o mês especificado
    SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO valor_conta
    FROM public.orcamento_empresa_valores oev
    INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
    WHERE oev.orcamento_empresa_id = orcamento_empresa_id
      AND oc.codigo = conta_codigo
      AND oev.mes BETWEEN 1 AND mes_final;
    
    -- Substituir na fórmula
    formula_processada := regexp_replace(formula_processada, 'C\.' || conta_codigo, valor_conta::TEXT, 'g');
  END LOOP;
  
  -- Avaliar a expressão matemática
  BEGIN
    -- Validar que só contém números e operadores seguros
    IF formula_processada ~ '^[0-9\+\-\*\/\(\)\.\s]+$' THEN
      EXECUTE 'SELECT ' || formula_processada INTO resultado;
    ELSE
      resultado := 0;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    resultado := 0;
  END;
  
  RETURN COALESCE(resultado, 0);
END;
$$ LANGUAGE plpgsql;

-- Ensure companies have proper group classifications
INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT 
  e.id,
  'porte',
  e.porte
FROM public.empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM public.empresa_grupos eg 
  WHERE eg.empresa_id = e.id AND eg.grupo_tipo = 'porte'
)
ON CONFLICT (empresa_id, grupo_tipo) DO UPDATE SET 
  grupo_valor = EXCLUDED.grupo_valor,
  updated_at = now();

INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT 
  e.id,
  'setor',
  e.setor
FROM public.empresas e
WHERE NOT EXISTS (
  SELECT 1 FROM public.empresa_grupos eg 
  WHERE eg.empresa_id = e.id AND eg.grupo_tipo = 'setor'
)
ON CONFLICT (empresa_id, grupo_tipo) DO UPDATE SET 
  grupo_valor = EXCLUDED.grupo_valor,
  updated_at = now();

-- Add faturamento classification based on revenue data
INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
SELECT 
  oe.empresa_id,
  'faturamento',
  CASE 
    WHEN COALESCE(receita_total.valor, 0) <= 360000 THEN 'mei'
    WHEN COALESCE(receita_total.valor, 0) <= 4800000 THEN 'pequeno'
    WHEN COALESCE(receita_total.valor, 0) <= 300000000 THEN 'medio'
    ELSE 'grande'
  END
FROM public.orcamento_empresas oe
LEFT JOIN (
  SELECT 
    oev.orcamento_empresa_id,
    SUM(oev.valor_realizado) as valor
  FROM public.orcamento_empresa_valores oev
  INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
  INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
  WHERE og.codigo LIKE '3%' -- Receitas
  GROUP BY oev.orcamento_empresa_id
) receita_total ON receita_total.orcamento_empresa_id = oe.id
WHERE oe.ano = EXTRACT(YEAR FROM CURRENT_DATE)
  AND NOT EXISTS (
    SELECT 1 FROM public.empresa_grupos eg 
    WHERE eg.empresa_id = oe.empresa_id AND eg.grupo_tipo = 'faturamento'
  )
ON CONFLICT (empresa_id, grupo_tipo) DO UPDATE SET 
  grupo_valor = EXCLUDED.grupo_valor,
  updated_at = now();
