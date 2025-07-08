
-- Adicionar campo para URL da imagem personalizada na tabela faixas_faturamento
ALTER TABLE public.faixas_faturamento 
ADD COLUMN imagem_url TEXT;

-- Criar comentário para documentar o novo campo
COMMENT ON COLUMN public.faixas_faturamento.imagem_url IS 'URL da imagem personalizada para o badge da faixa de faturamento';
