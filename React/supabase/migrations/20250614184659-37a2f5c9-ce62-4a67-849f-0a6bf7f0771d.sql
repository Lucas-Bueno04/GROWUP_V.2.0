
-- Criar nova função calcular_indicador_painel_empresa que pode interpretar CONTA_X_Y
CREATE OR REPLACE FUNCTION public.calcular_indicador_painel_empresa(
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
  
  -- Processar referências CONTA_X_Y (converter underscores para pontos)
  WHILE formula_processada ~ 'CONTA_[0-9_]+' LOOP
    -- Extrair o primeiro código CONTA_X_Y encontrado
    SELECT substring(formula_processada from 'CONTA_([0-9_]+)') INTO conta_codigo;
    
    -- Converter underscores para pontos
    conta_codigo := replace(conta_codigo, '_', '.');
    
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
    
    -- Substituir na fórmula (remover CONTA_ e underscores)
    formula_processada := regexp_replace(
      formula_processada, 
      'CONTA_' || replace(conta_codigo, '.', '_'), 
      valor_conta::TEXT, 
      'g'
    );
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

-- Atualizar função recalcular_medias_indicadores para usar a nova função
CREATE OR REPLACE FUNCTION public.recalcular_medias_indicadores(p_ano integer)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  indicador_rec RECORD;
  empresa_rec RECORD;
  grupo_rec RECORD;
  valor_indicador NUMERIC;
  soma_geral NUMERIC;
  soma_grupo NUMERIC;
  contador_geral INTEGER;
  contador_grupo INTEGER;
  indicador_medio_id UUID;
BEGIN
  -- Loop por todos os indicadores do plano de contas
  FOR indicador_rec IN 
    SELECT codigo, nome, formula FROM public.orcamento_indicadores
    ORDER BY codigo
  LOOP
    soma_geral := 0;
    contador_geral := 0;
    
    -- Calcular média geral usando a nova função
    FOR empresa_rec IN
      SELECT DISTINCT oe.empresa_id
      FROM public.orcamento_empresas oe
      WHERE oe.ano = p_ano AND oe.status = 'ativo'
    LOOP
      valor_indicador := public.calcular_indicador_painel_empresa(
        empresa_rec.empresa_id,
        indicador_rec.codigo,
        indicador_rec.formula,
        p_ano
      );
      
      IF valor_indicador IS NOT NULL AND valor_indicador != 0 THEN
        soma_geral := soma_geral + valor_indicador;
        contador_geral := contador_geral + 1;
      END IF;
    END LOOP;
    
    -- Inserir/atualizar média geral
    IF contador_geral > 0 THEN
      INSERT INTO public.indicadores_medios (
        ano, indicador_codigo, indicador_nome, media_geral, total_empresas
      )
      VALUES (
        p_ano, indicador_rec.codigo, indicador_rec.nome, 
        soma_geral / contador_geral, contador_geral
      )
      ON CONFLICT (ano, indicador_codigo)
      DO UPDATE SET 
        media_geral = EXCLUDED.media_geral,
        total_empresas = EXCLUDED.total_empresas,
        updated_at = now()
      RETURNING id INTO indicador_medio_id;
      
      -- Calcular médias por grupos
      FOR grupo_rec IN
        SELECT DISTINCT grupo_tipo, grupo_valor
        FROM public.empresa_grupos
        WHERE grupo_tipo IN ('porte', 'setor', 'faturamento')
      LOOP
        soma_grupo := 0;
        contador_grupo := 0;
        
        FOR empresa_rec IN
          SELECT DISTINCT oe.empresa_id
          FROM public.orcamento_empresas oe
          INNER JOIN public.empresa_grupos eg ON eg.empresa_id = oe.empresa_id
          WHERE oe.ano = p_ano 
            AND oe.status = 'ativo'
            AND eg.grupo_tipo = grupo_rec.grupo_tipo
            AND eg.grupo_valor = grupo_rec.grupo_valor
        LOOP
          valor_indicador := public.calcular_indicador_painel_empresa(
            empresa_rec.empresa_id,
            indicador_rec.codigo,
            indicador_rec.formula,
            p_ano
          );
          
          IF valor_indicador IS NOT NULL AND valor_indicador != 0 THEN
            soma_grupo := soma_grupo + valor_indicador;
            contador_grupo := contador_grupo + 1;
          END IF;
        END LOOP;
        
        -- Inserir/atualizar média do grupo
        IF contador_grupo > 0 THEN
          INSERT INTO public.indicadores_medios_grupos (
            indicador_medio_id, grupo_tipo, grupo_valor, 
            media_grupo, total_empresas_grupo
          )
          VALUES (
            indicador_medio_id, grupo_rec.grupo_tipo, grupo_rec.grupo_valor,
            soma_grupo / contador_grupo, contador_grupo
          )
          ON CONFLICT (indicador_medio_id, grupo_tipo, grupo_valor)
          DO UPDATE SET 
            media_grupo = EXCLUDED.media_grupo,
            total_empresas_grupo = EXCLUDED.total_empresas_grupo,
            updated_at = now();
        END IF;
      END LOOP;
    END IF;
  END LOOP;
END;
$$;
