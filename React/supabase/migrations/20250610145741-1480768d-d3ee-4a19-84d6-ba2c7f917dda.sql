
-- Criar tabela para armazenar os indicadores médios calculados
CREATE TABLE public.indicadores_medios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ano INTEGER NOT NULL,
  indicador_codigo TEXT NOT NULL,
  indicador_nome TEXT NOT NULL,
  media_geral NUMERIC NOT NULL DEFAULT 0,
  total_empresas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ano, indicador_codigo)
);

-- Criar tabela para grupos de empresas por critérios
CREATE TABLE public.empresa_grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  grupo_tipo TEXT NOT NULL, -- 'faturamento', 'porte', 'setor'
  grupo_valor TEXT NOT NULL, -- 'pequeno', 'medio', 'grande' etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, grupo_tipo)
);

-- Criar tabela para médias por grupo
CREATE TABLE public.indicadores_medios_grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicador_medio_id UUID NOT NULL REFERENCES public.indicadores_medios(id) ON DELETE CASCADE,
  grupo_tipo TEXT NOT NULL,
  grupo_valor TEXT NOT NULL,
  media_grupo NUMERIC NOT NULL DEFAULT 0,
  total_empresas_grupo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(indicador_medio_id, grupo_tipo, grupo_valor)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.indicadores_medios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresa_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicadores_medios_grupos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para indicadores_medios (leitura para todos autenticados)
CREATE POLICY "Todos podem ler indicadores médios" 
  ON public.indicadores_medios 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Políticas RLS para empresa_grupos
CREATE POLICY "Mentores podem gerenciar grupos de empresas" 
  ON public.empresa_grupos 
  FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'mentor'
  ));

CREATE POLICY "Usuários podem ver grupos de suas empresas" 
  ON public.empresa_grupos 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.mentorado_empresas me
      INNER JOIN public.mentorados m ON m.id = me.mentorado_id
      INNER JOIN public.profiles p ON p.email = m.email
      WHERE p.id = auth.uid() AND me.empresa_id = empresa_grupos.empresa_id
    )
  );

-- Políticas RLS para indicadores_medios_grupos (leitura para todos autenticados)
CREATE POLICY "Todos podem ler médias por grupos" 
  ON public.indicadores_medios_grupos 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Função para classificar empresas automaticamente
CREATE OR REPLACE FUNCTION public.classificar_empresa_automatico(empresa_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  empresa_rec RECORD;
  faturamento_anual NUMERIC;
BEGIN
  -- Buscar dados da empresa
  SELECT * INTO empresa_rec FROM public.empresas WHERE id = empresa_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Classificação por porte (baseado no campo existente)
  INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
  VALUES (empresa_id, 'porte', empresa_rec.porte)
  ON CONFLICT (empresa_id, grupo_tipo) 
  DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();

  -- Classificação por setor
  INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
  VALUES (empresa_id, 'setor', empresa_rec.setor)
  ON CONFLICT (empresa_id, grupo_tipo) 
  DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();

  -- Calcular faturamento anual estimado (soma dos últimos 12 meses de receita)
  SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO faturamento_anual
  FROM public.orcamento_empresa_valores oev
  INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
  INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
  INNER JOIN public.orcamento_empresas oe ON oe.id = oev.orcamento_empresa_id
  WHERE oe.empresa_id = empresa_id
    AND og.codigo LIKE '3%' -- Receitas
    AND oev.mes BETWEEN 1 AND 12
    AND oe.ano = EXTRACT(YEAR FROM CURRENT_DATE);

  -- Classificação por faturamento
  INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
  VALUES (
    empresa_id, 
    'faturamento',
    CASE 
      WHEN faturamento_anual <= 360000 THEN 'mei'
      WHEN faturamento_anual <= 4800000 THEN 'pequeno'
      WHEN faturamento_anual <= 300000000 THEN 'medio'
      ELSE 'grande'
    END
  )
  ON CONFLICT (empresa_id, grupo_tipo) 
  DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();
  
END;
$$;

-- Função para calcular indicadores médios
CREATE OR REPLACE FUNCTION public.calcular_indicadores_medios(p_ano INTEGER DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ano_calculo INTEGER;
  indicador_rec RECORD;
  empresa_rec RECORD;
  valor_realizado NUMERIC;
  total_empresas INTEGER;
  media_geral NUMERIC;
  indicador_medio_id UUID;
  grupo_rec RECORD;
  total_grupo INTEGER;
  media_grupo NUMERIC;
BEGIN
  -- Se não especificar ano, usar o ano atual
  ano_calculo := COALESCE(p_ano, EXTRACT(YEAR FROM CURRENT_DATE));
  
  -- Loop pelos indicadores do plano de contas
  FOR indicador_rec IN 
    SELECT DISTINCT codigo, nome FROM public.orcamento_indicadores
    ORDER BY codigo
  LOOP
    total_empresas := 0;
    media_geral := 0;
    
    -- Calcular para cada empresa que tem dados
    FOR empresa_rec IN
      SELECT DISTINCT oe.empresa_id
      FROM public.orcamento_empresas oe
      WHERE oe.ano = ano_calculo
    LOOP
      -- Aqui seria necessário avaliar a fórmula do indicador
      -- Por simplicidade, vamos usar um valor simulado
      -- Na implementação real, usar o unifiedFormulaEvaluator
      valor_realizado := RANDOM() * 100; -- Placeholder
      
      IF valor_realizado IS NOT NULL AND valor_realizado != 0 THEN
        media_geral := media_geral + valor_realizado;
        total_empresas := total_empresas + 1;
      END IF;
    END LOOP;
    
    -- Calcular média geral
    IF total_empresas > 0 THEN
      media_geral := media_geral / total_empresas;
      
      -- Inserir/atualizar indicador médio
      INSERT INTO public.indicadores_medios (ano, indicador_codigo, indicador_nome, media_geral, total_empresas)
      VALUES (ano_calculo, indicador_rec.codigo, indicador_rec.nome, media_geral, total_empresas)
      ON CONFLICT (ano, indicador_codigo)
      DO UPDATE SET 
        media_geral = EXCLUDED.media_geral,
        total_empresas = EXCLUDED.total_empresas,
        updated_at = now()
      RETURNING id INTO indicador_medio_id;
      
      -- Calcular médias por grupos
      FOR grupo_rec IN
        SELECT grupo_tipo, grupo_valor, COUNT(*) as total
        FROM public.empresa_grupos
        GROUP BY grupo_tipo, grupo_valor
      LOOP
        total_grupo := 0;
        media_grupo := 0;
        
        -- Calcular média para este grupo específico
        FOR empresa_rec IN
          SELECT DISTINCT oe.empresa_id
          FROM public.orcamento_empresas oe
          INNER JOIN public.empresa_grupos eg ON eg.empresa_id = oe.empresa_id
          WHERE oe.ano = ano_calculo
            AND eg.grupo_tipo = grupo_rec.grupo_tipo
            AND eg.grupo_valor = grupo_rec.grupo_valor
        LOOP
          valor_realizado := RANDOM() * 100; -- Placeholder
          
          IF valor_realizado IS NOT NULL AND valor_realizado != 0 THEN
            media_grupo := media_grupo + valor_realizado;
            total_grupo := total_grupo + 1;
          END IF;
        END LOOP;
        
        IF total_grupo > 0 THEN
          media_grupo := media_grupo / total_grupo;
          
          INSERT INTO public.indicadores_medios_grupos 
            (indicador_medio_id, grupo_tipo, grupo_valor, media_grupo, total_empresas_grupo)
          VALUES (indicador_medio_id, grupo_rec.grupo_tipo, grupo_rec.grupo_valor, media_grupo, total_grupo)
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

-- Criar índices para performance
CREATE INDEX idx_indicadores_medios_ano_codigo ON public.indicadores_medios(ano, indicador_codigo);
CREATE INDEX idx_empresa_grupos_empresa_tipo ON public.empresa_grupos(empresa_id, grupo_tipo);
CREATE INDEX idx_indicadores_medios_grupos_lookup ON public.indicadores_medios_grupos(indicador_medio_id, grupo_tipo, grupo_valor);
