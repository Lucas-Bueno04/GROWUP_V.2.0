
-- Adicionar coluna tipo_visualizacao na tabela indicadores_empresa
ALTER TABLE public.indicadores_empresa 
ADD COLUMN tipo_visualizacao text DEFAULT 'card' CHECK (tipo_visualizacao IN ('card', 'chart', 'list'));

-- Comentário explicativo da coluna
COMMENT ON COLUMN public.indicadores_empresa.tipo_visualizacao IS 'Define como o indicador será visualizado nos cartões estratégicos: card, chart ou list';
