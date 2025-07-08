
-- 1. Criar tabela para armazenar valores calculados dos grupos
CREATE TABLE public.orcamento_empresa_grupos_valores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_empresa_id UUID NOT NULL,
  grupo_id UUID NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  valor_calculado NUMERIC NOT NULL DEFAULT 0,
  valor_orcado NUMERIC NOT NULL DEFAULT 0,
  data_calculo TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraint para evitar duplicatas
  UNIQUE(orcamento_empresa_id, grupo_id, mes)
);

-- 2. Função para processar fórmulas (similar ao frontend)
CREATE OR REPLACE FUNCTION public.processar_formula_grupo(
  formula_entrada TEXT,
  orcamento_empresa_id UUID,
  mes_calculo INTEGER
) RETURNS NUMERIC
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  formula_processada TEXT;
  valor_grupo NUMERIC;
  grupo_codigo TEXT;
  resultado NUMERIC := 0;
BEGIN
  formula_processada := formula_entrada;
  
  -- Processar referências de grupos G{número}
  WHILE formula_processada ~ 'G\d+' LOOP
    SELECT substring(formula_processada from 'G(\d+)') INTO grupo_codigo;
    
    -- Buscar valor já calculado ou calcular se necessário
    SELECT COALESCE(oegv.valor_calculado, 0) INTO valor_grupo
    FROM public.orcamento_empresa_grupos_valores oegv
    INNER JOIN public.orcamento_grupos og ON og.id = oegv.grupo_id
    WHERE oegv.orcamento_empresa_id = processar_formula_grupo.orcamento_empresa_id
      AND og.codigo = grupo_codigo
      AND oegv.mes = mes_calculo;
    
    -- Se não encontrou valor calculado, calcular pela soma das contas
    IF valor_grupo IS NULL THEN
      SELECT COALESCE(SUM(
        CASE 
          WHEN oc.sinal = '+' THEN oev.valor_realizado
          ELSE -oev.valor_realizado
        END
      ), 0) INTO valor_grupo
      FROM public.orcamento_empresa_valores oev
      INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
      INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
      WHERE oev.orcamento_empresa_id = processar_formula_grupo.orcamento_empresa_id
        AND og.codigo = grupo_codigo
        AND oev.mes = mes_calculo;
    END IF;
    
    formula_processada := regexp_replace(
      formula_processada, 'G' || grupo_codigo, COALESCE(valor_grupo, 0)::TEXT, 'g'
    );
  END LOOP;
  
  -- Avaliar expressão matemática
  BEGIN
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
$$;

-- 3. Função principal para recalcular valores dos grupos
CREATE OR REPLACE FUNCTION public.recalcular_grupos_valores(
  p_orcamento_empresa_id UUID,
  p_mes INTEGER DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  grupo_rec RECORD;
  mes_atual INTEGER;
  valor_calculado NUMERIC;
  valor_orcado NUMERIC;
  total_processados INTEGER := 0;
BEGIN
  -- Se não especificar mês, processar todos os 12 meses
  FOR mes_atual IN 1..12 LOOP
    -- Pular se um mês específico foi solicitado e não é este
    CONTINUE WHEN p_mes IS NOT NULL AND mes_atual != p_mes;
    
    -- Processar grupos em ordem (soma primeiro, depois calculados)
    FOR grupo_rec IN 
      SELECT id, codigo, nome, tipo_calculo, formula, ordem
      FROM public.orcamento_grupos 
      ORDER BY 
        CASE WHEN tipo_calculo = 'soma' THEN 1 ELSE 2 END,
        ordem
    LOOP
      valor_calculado := 0;
      valor_orcado := 0;
      
      IF grupo_rec.tipo_calculo = 'soma' THEN
        -- Calcular soma das contas (realizado)
        SELECT COALESCE(SUM(
          CASE 
            WHEN oc.sinal = '+' THEN oev.valor_realizado
            ELSE -oev.valor_realizado
          END
        ), 0) INTO valor_calculado
        FROM public.orcamento_empresa_valores oev
        INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
        WHERE oev.orcamento_empresa_id = p_orcamento_empresa_id
          AND oc.grupo_id = grupo_rec.id
          AND oev.mes = mes_atual;
          
        -- Calcular soma das contas (orçado)
        SELECT COALESCE(SUM(
          CASE 
            WHEN oc.sinal = '+' THEN oev.valor_orcado
            ELSE -oev.valor_orcado
          END
        ), 0) INTO valor_orcado
        FROM public.orcamento_empresa_valores oev
        INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
        WHERE oev.orcamento_empresa_id = p_orcamento_empresa_id
          AND oc.grupo_id = grupo_rec.id
          AND oev.mes = mes_atual;
          
      ELSIF grupo_rec.tipo_calculo = 'calculado' AND grupo_rec.formula IS NOT NULL THEN
        -- Processar fórmula
        valor_calculado := public.processar_formula_grupo(
          grupo_rec.formula, p_orcamento_empresa_id, mes_atual
        );
        
        -- Para grupos calculados, orçado = calculado (por enquanto)
        valor_orcado := valor_calculado;
      END IF;
      
      -- Inserir ou atualizar valor
      INSERT INTO public.orcamento_empresa_grupos_valores (
        orcamento_empresa_id, grupo_id, mes, valor_calculado, valor_orcado
      ) VALUES (
        p_orcamento_empresa_id, grupo_rec.id, mes_atual, valor_calculado, valor_orcado
      )
      ON CONFLICT (orcamento_empresa_id, grupo_id, mes)
      DO UPDATE SET 
        valor_calculado = EXCLUDED.valor_calculado,
        valor_orcado = EXCLUDED.valor_orcado,
        data_calculo = now(),
        updated_at = now();
      
      total_processados := total_processados + 1;
    END LOOP;
  END LOOP;
  
  RETURN total_processados;
END;
$$;

-- 4. Trigger para recalcular automaticamente quando valores de contas mudarem
CREATE OR REPLACE FUNCTION public.trigger_recalcular_grupos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Recalcular apenas o mês afetado
  PERFORM public.recalcular_grupos_valores(
    COALESCE(NEW.orcamento_empresa_id, OLD.orcamento_empresa_id),
    COALESCE(NEW.mes, OLD.mes)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_recalcular_grupos_valores ON public.orcamento_empresa_valores;
CREATE TRIGGER trigger_recalcular_grupos_valores
  AFTER INSERT OR UPDATE OR DELETE ON public.orcamento_empresa_valores
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalcular_grupos();

-- 5. Função para inicializar valores para orçamentos existentes
CREATE OR REPLACE FUNCTION public.inicializar_grupos_valores_existentes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  orcamento_rec RECORD;
  total_inicializados INTEGER := 0;
BEGIN
  FOR orcamento_rec IN 
    SELECT id FROM public.orcamento_empresas WHERE status = 'ativo'
  LOOP
    PERFORM public.recalcular_grupos_valores(orcamento_rec.id);
    total_inicializados := total_inicializados + 1;
  END LOOP;
  
  RETURN total_inicializados;
END;
$$;

-- 6. Executar inicialização (comentar se não quiser executar automaticamente)
-- SELECT public.inicializar_grupos_valores_existentes();
