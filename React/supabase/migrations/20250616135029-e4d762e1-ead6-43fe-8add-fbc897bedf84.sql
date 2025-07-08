
-- Add the annual revenue field to empresas table
ALTER TABLE public.empresas 
ADD COLUMN faturamento_anual_anterior NUMERIC DEFAULT 0;

-- Create the classification badges table
CREATE TABLE public.classification_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  min_revenue NUMERIC NOT NULL,
  max_revenue NUMERIC NOT NULL,
  order_index INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the classification badges
INSERT INTO public.classification_badges (name, description, icon, color, min_revenue, max_revenue, order_index, points) VALUES
('Newborn (MEI)', 'Microempreendedor Individual - Início da jornada', 'baby', '#10B981', 0, 360000, 1, 50),
('Early Walker (Pequeno)', 'Pequena empresa - Primeiros passos', 'footprints', '#3B82F6', 360001, 4800000, 2, 100),
('Scaler (Médio)', 'Média empresa - Crescimento acelerado', 'trending-up', '#F59E0B', 4800001, 300000000, 3, 200),
('Authority (Grande)', 'Grande empresa - Autoridade no mercado', 'crown', '#8B5CF6', 300000001, 999999999999, 4, 500);

-- Create company classification history table
CREATE TABLE public.company_classification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  previous_classification TEXT,
  new_classification TEXT NOT NULL,
  previous_revenue NUMERIC,
  current_revenue NUMERIC NOT NULL,
  classification_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  growth_percentage NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company badge awards table
CREATE TABLE public.company_badge_awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.classification_badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_notified BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(empresa_id, badge_id)
);

-- Enable RLS on new tables
ALTER TABLE public.classification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_classification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_badge_awards ENABLE ROW LEVEL SECURITY;

-- RLS policies for classification_badges (readable by all authenticated users)
CREATE POLICY "Anyone can view classification badges" 
ON public.classification_badges FOR SELECT 
TO authenticated USING (true);

-- RLS policies for company_classification_history (accessible based on company access)
CREATE POLICY "Users can view classification history for accessible companies" 
ON public.company_classification_history FOR SELECT 
TO authenticated 
USING (public.user_has_empresa_access(auth.uid(), empresa_id));

-- RLS policies for company_badge_awards (accessible based on company access)
CREATE POLICY "Users can view badge awards for accessible companies" 
ON public.company_badge_awards FOR SELECT 
TO authenticated 
USING (public.user_has_empresa_access(auth.uid(), empresa_id));

-- Create function to calculate current year revenue
CREATE OR REPLACE FUNCTION public.calcular_receita_atual_empresa(p_empresa_id UUID, p_ano INTEGER DEFAULT NULL)
RETURNS NUMERIC AS $$
DECLARE
  receita_atual NUMERIC := 0;
  ano_calculo INTEGER;
BEGIN
  -- Use current year if not specified
  ano_calculo := COALESCE(p_ano, EXTRACT(YEAR FROM CURRENT_DATE));
  
  -- Calculate sum of revenues (G1 - receitas operacionais) for the year
  SELECT COALESCE(SUM(oev.valor_realizado), 0) INTO receita_atual
  FROM public.orcamento_empresa_valores oev
  INNER JOIN public.orcamento_contas oc ON oc.id = oev.conta_id
  INNER JOIN public.orcamento_grupos og ON og.id = oc.grupo_id
  INNER JOIN public.orcamento_empresas oe ON oe.id = oev.orcamento_empresa_id
  WHERE oe.empresa_id = p_empresa_id
    AND og.codigo = '1' -- Receitas operacionais
    AND oe.ano = ano_calculo;
    
  RETURN COALESCE(receita_atual, 0);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create function to classify company and award badges
CREATE OR REPLACE FUNCTION public.classificar_empresa_por_receita(p_empresa_id UUID)
RETURNS VOID AS $$
DECLARE
  empresa_rec RECORD;
  receita_atual NUMERIC;
  receita_anterior NUMERIC;
  nova_classificacao TEXT;
  classificacao_anterior TEXT;
  badge_rec RECORD;
  growth_percentage NUMERIC;
BEGIN
  -- Get company data
  SELECT * INTO empresa_rec FROM public.empresas WHERE id = p_empresa_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Calculate current year revenue
  receita_atual := public.calcular_receita_atual_empresa(p_empresa_id);
  receita_anterior := COALESCE(empresa_rec.faturamento_anual_anterior, 0);
  
  -- Get current classification from empresa_grupos
  SELECT grupo_valor INTO classificacao_anterior
  FROM public.empresa_grupos
  WHERE empresa_id = p_empresa_id AND grupo_tipo = 'faturamento'
  LIMIT 1;
  
  -- Determine new classification based on current revenue
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to auto-classify when budget values change
CREATE OR REPLACE FUNCTION public.trigger_classificar_empresa()
RETURNS TRIGGER AS $$
BEGIN
  -- Trigger classification when budget values are updated
  PERFORM public.classificar_empresa_por_receita(
    (SELECT oe.empresa_id FROM public.orcamento_empresas oe WHERE oe.id = NEW.orcamento_empresa_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orcamento_empresa_valores
CREATE TRIGGER trigger_classificacao_empresa
  AFTER INSERT OR UPDATE OF valor_realizado ON public.orcamento_empresa_valores
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_classificar_empresa();
