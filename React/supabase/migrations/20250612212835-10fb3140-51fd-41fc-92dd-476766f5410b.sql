
-- Criar função para calcular indicadores médios automaticamente
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
  conta_codigo TEXT;
  mes_atual INTEGER;
  mes_final INTEGER;
BEGIN
  -- Determinar até que mês calcular
  mes_final := COALESCE(p_mes_ate, 12);
  
  -- Processar fórmula para substituir referências de contas
  formula_processada := p_formula;
  
  -- Encontrar todas as referências C.X.Y.Z na fórmula
  FOR conta_codigo IN 
    SELECT unnest(regexp_split_to_array(
      regexp_replace(formula_processada, '.*C\.([0-9\.]+).*', '\1', 'g'), 
      '\.'
    ))
  LOOP
    -- Buscar valor acumulado da conta até o mês especificado
    SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO valor_conta
    FROM public.orcamento_empresa_valores oev
    INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
    INNER JOIN public.orcamento_empresas oe ON oe.id = oev.orcamento_empresa_id
    WHERE oe.empresa_id = p_empresa_id
      AND oe.ano = p_ano
      AND oc.codigo = conta_codigo
      AND oev.mes BETWEEN 1 AND mes_final;
    
    -- Substituir na fórmula
    formula_processada := replace(formula_processada, 'C.' || conta_codigo, valor_conta::TEXT);
  END LOOP;
  
  -- Avaliar a expressão matemática (implementação simplificada)
  -- Na versão real, usar o evaluateUnifiedFormula
  BEGIN
    EXECUTE 'SELECT ' || formula_processada INTO resultado;
  EXCEPTION WHEN OTHERS THEN
    resultado := 0;
  END;
  
  RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Função para recalcular médias de indicadores
CREATE OR REPLACE FUNCTION public.recalcular_medias_indicadores(p_ano INTEGER)
RETURNS VOID AS $$
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
    
    -- Calcular média geral
    FOR empresa_rec IN
      SELECT DISTINCT oe.empresa_id
      FROM public.orcamento_empresas oe
      WHERE oe.ano = p_ano AND oe.status = 'ativo'
    LOOP
      valor_indicador := public.calcular_indicador_empresa(
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
          valor_indicador := public.calcular_indicador_empresa(
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
$$ LANGUAGE plpgsql;

-- Habilitar RLS nas tabelas de cache de insights (já existe)
-- Políticas RLS já estão configuradas

-- Criar índices para performance se não existirem
CREATE INDEX IF NOT EXISTS idx_empresa_grupos_empresa_tipo ON public.empresa_grupos(empresa_id, grupo_tipo);
CREATE INDEX IF NOT EXISTS idx_indicadores_medios_ano_codigo ON public.indicadores_medios(ano, indicador_codigo);
CREATE INDEX IF NOT EXISTS idx_indicadores_medios_grupos_lookup ON public.indicadores_medios_grupos(indicador_medio_id, grupo_tipo, grupo_valor);
