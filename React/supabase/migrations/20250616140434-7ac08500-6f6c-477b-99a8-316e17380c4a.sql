
-- First, clean up existing badge awards to avoid foreign key conflicts
DELETE FROM public.company_badge_awards;

-- Drop the existing classification_badges table if it exists
DROP TABLE IF EXISTS public.classification_badges CASCADE;

-- Create a new classification_badges table that maps to faixas_faturamento
CREATE TABLE public.classification_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- This will match faixas_faturamento.nome
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'baby',
  color TEXT NOT NULL DEFAULT '#10b981',
  min_revenue NUMERIC NOT NULL DEFAULT 0,
  max_revenue NUMERIC NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert badges that match the faixas_faturamento table
INSERT INTO public.classification_badges (name, description, icon, color, min_revenue, max_revenue, order_index, points) VALUES
('Newborn (MEI)', 'Empresas em fase inicial com faturamento até R$ 360.000', 'baby', '#f59e0b', 0, 360000, 1, 100),
('Early Walker (Pequeno)', 'Pequenas empresas com faturamento até R$ 4.8M', 'footprints', '#10b981', 360001, 4800000, 2, 200),
('Scaler (Médio)', 'Médias empresas em crescimento acelerado', 'trending-up', '#3b82f6', 4800001, 300000000, 3, 300),
('Authority (Grande)', 'Grandes empresas consolidadas no mercado', 'crown', '#8b5cf6', 300000001, 999999999999, 4, 400);

-- Update company_badge_awards table to ensure proper foreign key
ALTER TABLE public.company_badge_awards 
DROP CONSTRAINT IF EXISTS company_badge_awards_badge_id_fkey;

ALTER TABLE public.company_badge_awards 
ADD CONSTRAINT company_badge_awards_badge_id_fkey 
FOREIGN KEY (badge_id) REFERENCES public.classification_badges(id) ON DELETE CASCADE;

-- Ensure empresa_id foreign key exists
ALTER TABLE public.company_badge_awards 
DROP CONSTRAINT IF EXISTS company_badge_awards_empresa_id_fkey;

ALTER TABLE public.company_badge_awards 
ADD CONSTRAINT company_badge_awards_empresa_id_fkey 
FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;

-- Update the classification function to use the new badges
CREATE OR REPLACE FUNCTION public.classificar_empresa_por_receita(p_empresa_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  receita_atual NUMERIC;
  receita_anterior NUMERIC;
  nova_classificacao TEXT;
  classificacao_anterior TEXT;
  badge_rec RECORD;
  growth_percentage NUMERIC;
BEGIN
  -- Calculate current year revenue
  receita_atual := public.calcular_receita_atual_empresa(p_empresa_id);
  
  -- Get previous revenue (you can implement this logic based on your needs)
  receita_anterior := 0;
  
  -- Get current classification from empresa_grupos
  SELECT grupo_valor INTO classificacao_anterior
  FROM public.empresa_grupos
  WHERE empresa_id = p_empresa_id AND grupo_tipo = 'faturamento'
  LIMIT 1;
  
  -- Determine new classification based on current revenue using classification_badges
  SELECT name INTO nova_classificacao
  FROM public.classification_badges
  WHERE receita_atual >= min_revenue AND receita_atual <= max_revenue
  ORDER BY order_index
  LIMIT 1;
  
  -- If no classification found, use the highest one
  IF nova_classificacao IS NULL THEN
    SELECT name INTO nova_classificacao
    FROM public.classification_badges
    ORDER BY order_index DESC
    LIMIT 1;
  END IF;
  
  -- Update or insert classification in empresa_grupos
  INSERT INTO public.empresa_grupos (empresa_id, grupo_tipo, grupo_valor)
  VALUES (p_empresa_id, 'faturamento', nova_classificacao)
  ON CONFLICT (empresa_id, grupo_tipo) 
  DO UPDATE SET grupo_valor = EXCLUDED.grupo_valor, updated_at = now();
  
  -- Calculate growth percentage
  IF receita_anterior > 0 THEN
    growth_percentage := ((receita_atual - receita_anterior) / receita_anterior) * 100;
  ELSE
    growth_percentage := NULL;
  END IF;
  
  -- Record classification history if there's a change
  IF classificacao_anterior IS NULL OR classificacao_anterior != nova_classificacao THEN
    INSERT INTO public.company_classification_history (
      empresa_id, previous_classification, new_classification, 
      previous_revenue, current_revenue, growth_percentage
    ) VALUES (
      p_empresa_id, classificacao_anterior, nova_classificacao,
      receita_anterior, receita_atual, growth_percentage
    );
    
    -- Award badge for new classification
    SELECT * INTO badge_rec 
    FROM public.classification_badges 
    WHERE name = nova_classificacao;
    
    IF FOUND THEN
      INSERT INTO public.company_badge_awards (empresa_id, badge_id)
      VALUES (p_empresa_id, badge_rec.id)
      ON CONFLICT (empresa_id, badge_id) DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- Enable Row Level Security on new tables
ALTER TABLE public.classification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_badge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_classification_history ENABLE ROW LEVEL SECURITY;

-- Create policies for classification_badges (readable by all authenticated users)
CREATE POLICY "Anyone can view classification badges" 
ON public.classification_badges 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policies for company_badge_awards (users can see awards for companies they have access to)
CREATE POLICY "Users can view company badge awards they have access to" 
ON public.company_badge_awards 
FOR SELECT 
TO authenticated 
USING (public.user_has_empresa_access(auth.uid(), empresa_id));

-- Create policies for company_classification_history (users can see history for companies they have access to)
CREATE POLICY "Users can view company classification history they have access to" 
ON public.company_classification_history 
FOR SELECT 
TO authenticated 
USING (public.user_has_empresa_access(auth.uid(), empresa_id));

-- Add trigger to automatically classify companies when budget values change
CREATE OR REPLACE FUNCTION public.trigger_classificar_empresa()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Trigger classification when budget values are updated
  PERFORM public.classificar_empresa_por_receita(
    (SELECT oe.empresa_id FROM public.orcamento_empresas oe WHERE oe.id = NEW.orcamento_empresa_id)
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger on orcamento_empresa_valores
DROP TRIGGER IF EXISTS trigger_classify_company_on_budget_update ON public.orcamento_empresa_valores;
CREATE TRIGGER trigger_classify_company_on_budget_update
  AFTER INSERT OR UPDATE ON public.orcamento_empresa_valores
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_classificar_empresa();
