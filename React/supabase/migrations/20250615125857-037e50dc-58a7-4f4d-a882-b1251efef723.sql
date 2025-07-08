
-- Criar tabela para armazenar as faixas de faturamento configuráveis
CREATE TABLE public.faixas_faturamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  valor_minimo NUMERIC NOT NULL DEFAULT 0,
  valor_maximo NUMERIC NOT NULL,
  ativa BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para performance
CREATE INDEX idx_faixas_faturamento_ativa ON public.faixas_faturamento(ativa);
CREATE INDEX idx_faixas_faturamento_ordem ON public.faixas_faturamento(ordem);

-- Inserir as faixas padrão baseadas no sistema atual
INSERT INTO public.faixas_faturamento (nome, valor_minimo, valor_maximo, ativa, ordem) VALUES
('Newborn (MEI)', 0, 360000, true, 1),
('Early Walker (Pequeno)', 360001, 4800000, true, 2),
('Scaler (Médio)', 4800001, 300000000, true, 3),
('Authority (Grande)', 300000001, 999999999999, true, 4);

-- Habilitar Row Level Security
ALTER TABLE public.faixas_faturamento ENABLE ROW LEVEL SECURITY;

-- Criar política que permite leitura para todos os usuários autenticados
CREATE POLICY "Authenticated users can read revenue ranges" 
ON public.faixas_faturamento 
FOR SELECT 
TO authenticated 
USING (true);

-- Criar política que permite apenas mentores modificarem as faixas
CREATE POLICY "Mentors can manage revenue ranges" 
ON public.faixas_faturamento 
FOR ALL 
TO authenticated 
USING (public.is_mentor(auth.uid()))
WITH CHECK (public.is_mentor(auth.uid()));

-- Atualizar a função de classificação automática para usar as faixas do banco
CREATE OR REPLACE FUNCTION public.classificar_empresa_automatico(p_empresa_id UUID)
RETURNS VOID AS $$
DECLARE
  empresa_rec RECORD;
  faturamento_anual NUMERIC;
  faixa_rec RECORD;
  faixa_codigo TEXT;
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

    -- Classificar com base nas faixas configuradas no banco
    SELECT nome INTO faixa_codigo
    FROM public.faixas_faturamento
    WHERE ativa = true 
      AND faturamento_anual >= valor_minimo 
      AND faturamento_anual <= valor_maximo
    ORDER BY ordem
    LIMIT 1;

    -- Se não encontrou uma faixa específica, usar a última faixa (maior)
    IF faixa_codigo IS NULL THEN
      SELECT nome INTO faixa_codigo
      FROM public.faixas_faturamento
      WHERE ativa = true
      ORDER BY ordem DESC
      LIMIT 1;
    END IF;

    -- Inserir ou atualizar classificação por faturamento
    INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
    VALUES (p_empresa_id, 'faturamento', COALESCE(faixa_codigo, 'Não Classificado'))
    ON CONFLICT (empresa_id, grupo_tipo) 
    DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Criar função para migrar dados do localStorage para o banco (será chamada do frontend)
CREATE OR REPLACE FUNCTION public.migrate_revenue_ranges_from_config(ranges_json JSONB)
RETURNS VOID AS $$
DECLARE
  range_item JSONB;
BEGIN
  -- Limpar faixas existentes
  DELETE FROM public.faixas_faturamento;
  
  -- Inserir novas faixas do JSON
  FOR range_item IN SELECT * FROM jsonb_array_elements(ranges_json)
  LOOP
    INSERT INTO public.faixas_faturamento (
      id, nome, valor_minimo, valor_maximo, ativa, ordem
    ) VALUES (
      (range_item->>'id')::UUID,
      range_item->>'nome',
      (range_item->>'valorMinimo')::NUMERIC,
      (range_item->>'valorMaximo')::NUMERIC,
      (range_item->>'ativa')::BOOLEAN,
      COALESCE((range_item->>'ordem')::INTEGER, 1)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
