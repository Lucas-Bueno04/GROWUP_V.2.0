
-- Primeiro, remover a função existente
DROP FUNCTION IF EXISTS public.classificar_empresa_automatico(uuid);

-- Recriar a função com a correção
CREATE OR REPLACE FUNCTION public.classificar_empresa_automatico(p_empresa_id UUID)
RETURNS VOID AS $$
DECLARE
  empresa_rec RECORD;
  faturamento_anual NUMERIC;
BEGIN
  -- Buscar dados da empresa
  SELECT porte, setor INTO empresa_rec
  FROM public.empresas 
  WHERE id = p_empresa_id;
  
  IF FOUND THEN
    -- Inserir ou atualizar classificação por porte
    INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
    VALUES (p_empresa_id, 'porte', empresa_rec.porte)
    ON CONFLICT (empresa_id, grupo_tipo) 
    DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();
    
    -- Inserir ou atualizar classificação por setor
    INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
    VALUES (p_empresa_id, 'setor', empresa_rec.setor)
    ON CONFLICT (empresa_id, grupo_tipo) 
    DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();

    -- Calcular faturamento anual estimado (soma dos últimos 12 meses de receita)
    SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO faturamento_anual
    FROM public.orcamento_empresa_valores oev
    INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
    INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
    INNER JOIN public.orcamento_empresas oe ON oe.id = oev.orcamento_empresa_id
    WHERE oe.empresa_id = p_empresa_id
      AND og.codigo LIKE '3%' -- Receitas
      AND oev.mes BETWEEN 1 AND 12
      AND oe.ano = EXTRACT(YEAR FROM CURRENT_DATE);

    -- Inserir ou atualizar classificação por faturamento
    INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
    VALUES (
      p_empresa_id, 
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
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela para cache de insights de IA
CREATE TABLE IF NOT EXISTS public.ai_insights_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  insights_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, ano, mes)
);

-- Habilitar RLS na tabela de cache
ALTER TABLE public.ai_insights_cache ENABLE ROW LEVEL SECURITY;

-- Política RLS para insights cache
DROP POLICY IF EXISTS "Usuários podem acessar insights de suas empresas" ON public.ai_insights_cache;
CREATE POLICY "Usuários podem acessar insights de suas empresas" 
  ON public.ai_insights_cache 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.mentorado_empresas me
      INNER JOIN public.mentorados m ON m.id = me.mentorado_id
      INNER JOIN public.profiles p ON p.email = m.email
      WHERE p.id = auth.uid() AND me.empresa_id = ai_insights_cache.empresa_id
    ) OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'mentor'
    )
  );

-- Popular dados de exemplo para indicadores médios (ano 2025)
INSERT INTO public.indicadores_medios (ano, indicador_codigo, indicador_nome, media_geral, total_empresas)
VALUES 
  (2025, 'IND001', 'Margem Líquida', 12.5, 150),
  (2025, 'IND002', 'ROE - Return on Equity', 18.7, 142),
  (2025, 'IND003', 'Liquidez Corrente', 2.1, 165),
  (2025, 'IND004', 'Endividamento Geral', 45.3, 158),
  (2025, 'IND005', 'Giro do Ativo', 1.8, 147),
  (2025, 'IND006', 'Margem EBITDA', 22.8, 139),
  (2025, 'IND007', 'Prazo Médio de Recebimento', 35.2, 163),
  (2025, 'IND008', 'Crescimento da Receita', 8.4, 156)
ON CONFLICT (ano, indicador_codigo) DO NOTHING;

-- Popular médias por grupos para os indicadores
WITH indicadores_ids AS (
  SELECT id, indicador_codigo FROM public.indicadores_medios WHERE ano = 2025
)
INSERT INTO public.indicadores_medios_grupos (indicador_medio_id, grupo_tipo, grupo_valor, media_grupo, total_empresas_grupo)
SELECT 
  i.id,
  'porte',
  grupo_porte.valor,
  grupo_porte.media,
  grupo_porte.total
FROM indicadores_ids i
CROSS JOIN (
  VALUES 
    ('pequeno', 10.2, 45),
    ('medio', 14.8, 67),
    ('grande', 16.3, 38)
) AS grupo_porte(valor, media, total)
WHERE i.indicador_codigo = 'IND001'

UNION ALL

SELECT 
  i.id,
  'setor',
  grupo_setor.valor,
  grupo_setor.media,
  grupo_setor.total
FROM indicadores_ids i
CROSS JOIN (
  VALUES 
    ('comercio', 11.8, 52),
    ('servicos', 13.7, 61),
    ('industria', 12.1, 37)
) AS grupo_setor(valor, media, total)
WHERE i.indicador_codigo = 'IND001'

UNION ALL

-- ROE por porte
SELECT 
  i.id,
  'porte',
  grupo_porte.valor,
  grupo_porte.media,
  grupo_porte.total
FROM indicadores_ids i
CROSS JOIN (
  VALUES 
    ('pequeno', 15.4, 42),
    ('medio', 19.8, 63),
    ('grande', 21.2, 37)
) AS grupo_porte(valor, media, total)
WHERE i.indicador_codigo = 'IND002'

UNION ALL

-- Liquidez Corrente por porte
SELECT 
  i.id,
  'porte',
  grupo_porte.valor,
  grupo_porte.media,
  grupo_porte.total
FROM indicadores_ids i
CROSS JOIN (
  VALUES 
    ('pequeno', 1.8, 48),
    ('medio', 2.2, 69),
    ('grande', 2.4, 48)
) AS grupo_porte(valor, media, total)
WHERE i.indicador_codigo = 'IND003'
ON CONFLICT (indicador_medio_id, grupo_tipo, grupo_valor) DO NOTHING;

-- Classificar empresas existentes automaticamente
DO $$
DECLARE
  empresa_record RECORD;
BEGIN
  FOR empresa_record IN SELECT id FROM public.empresas LOOP
    PERFORM public.classificar_empresa_automatico(empresa_record.id);
  END LOOP;
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_insights_cache_empresa_periodo ON public.ai_insights_cache(empresa_id, ano, mes);
CREATE INDEX IF NOT EXISTS idx_ai_insights_cache_created ON public.ai_insights_cache(created_at);
