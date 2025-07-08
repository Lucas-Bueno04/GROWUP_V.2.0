
-- Atualizar a função calcular_indicador_empresa para usar avaliação segura
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
  calc_result NUMERIC;
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
    SELECT COALESCE(SUM(
      CASE 
        WHEN oc.sinal = '+' THEN oev.valor_realizado
        ELSE -oev.valor_realizado
      END
    ), 0) INTO valor_grupo
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
    SELECT COALESCE(SUM(
      CASE 
        WHEN oc.sinal = '+' THEN oev.valor_realizado
        ELSE -oev.valor_realizado
      END
    ), 0) INTO valor_conta
    FROM public.orcamento_empresa_valores oev
    INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
    WHERE oev.orcamento_empresa_id = orcamento_empresa_id
      AND oc.codigo = conta_codigo
      AND oev.mes BETWEEN 1 AND mes_final;
    
    -- Substituir na fórmula
    formula_processada := regexp_replace(formula_processada, 'C\.' || conta_codigo, valor_conta::TEXT, 'g');
  END LOOP;
  
  -- Avaliar a expressão matemática de forma segura
  BEGIN
    -- Implementação de avaliação segura para expressões matemáticas básicas
    -- Substituir abs() por valor absoluto simples
    formula_processada := regexp_replace(formula_processada, 'abs\(([^)]+)\)', 'ABS(\1)', 'g');
    
    -- Para expressões simples, tentar avaliação direta
    IF formula_processada ~ '^[0-9\+\-\*\/\(\)\.\s]+$' THEN
      EXECUTE 'SELECT ' || formula_processada INTO calc_result;
      resultado := COALESCE(calc_result, 0);
    ELSE
      -- Para fórmulas mais complexas, implementar lógica de fallback
      IF formula_processada ~* 'ABS' THEN
        -- Tentar processar função ABS de forma simples
        formula_processada := regexp_replace(formula_processada, 'ABS\(([^)]+)\)', '(\1)', 'g');
        IF formula_processada ~ '^[0-9\+\-\*\/\(\)\.\s]+$' THEN
          EXECUTE 'SELECT ABS(' || formula_processada || ')' INTO calc_result;
          resultado := COALESCE(calc_result, 0);
        ELSE
          resultado := 0;
        END IF;
      ELSE
        resultado := 0;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log do erro para debug
    RAISE NOTICE 'Erro ao avaliar fórmula: %, fórmula processada: %', SQLERRM, formula_processada;
    resultado := 0;
  END;
  
  RETURN COALESCE(resultado, 0);
END;
$$ LANGUAGE plpgsql;
