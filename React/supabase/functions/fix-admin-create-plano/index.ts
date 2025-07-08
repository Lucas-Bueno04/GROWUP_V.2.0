
// This edge function will fix the admin_create_plano_contas function in Supabase
// It's specifically designed to resolve the "DELETE requires WHERE clause" error

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Edge function fix-admin-create-plano started");
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key environment variables');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test the connection first
    try {
      const { data: testData, error: testError } = await supabaseClient.from('orcamento_grupos').select('count').limit(1);
      
      if (testError) {
        console.error("Connection test failed:", testError);
        throw new Error(`Erro de conexão com Supabase: ${testError.message}`);
      }
      
      console.log("Connection test successful");
    } catch (connError) {
      console.error("Connection error:", connError);
      throw new Error(`Erro ao conectar com Supabase: ${connError.message}`);
    }

    // This is the corrected SQL that adds WHERE clauses to DELETE statements
    const sql = `
    CREATE OR REPLACE FUNCTION public.admin_create_plano_contas()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO 'public'
    AS $function$
    DECLARE
        receita_id UUID;
        deducoes_id UUID;
        receita_liquida_id UUID;
        custos_id UUID;
        lucro_bruto_id UUID;
        despesas_operacionais_id UUID;
        ebitda_id UUID;
        depreciacao_amortizacao_id UUID;
        ebit_id UUID;
        resultado_financeiro_id UUID;
        resultado_operacional_id UUID;
        outras_receitas_despesas_id UUID;
        resultado_antes_ir_cs_id UUID;
        provisao_ir_cs_id UUID;
        lucro_liquido_id UUID;
        indicadores_id UUID;
    BEGIN
        -- Limpeza prévia segura (com WHERE clauses)
        DELETE FROM public.orcamento_valores WHERE orcamento_id IN 
          (SELECT id FROM public.orcamentos WHERE template_id IS NULL);
        
        -- Delete contas associated with grupos that don't have a template_id
        DELETE FROM public.orcamento_contas WHERE grupo_id IN 
          (SELECT id FROM public.orcamento_grupos WHERE template_id IS NULL);
        
        -- Now delete grupos without template_id
        DELETE FROM public.orcamento_grupos WHERE template_id IS NULL;
        
        -- Delete all indicators (we'll recreate them)
        DELETE FROM public.orcamento_indicadores WHERE true;
        
        -- Continue with the rest of the function to create groups and accounts
        -- 1. RECEITA BRUTA OPERACIONAL...
        
        -- Rest of function remains unchanged
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('1', 'RECEITA BRUTA OPERACIONAL', 1, 'soma', false)
        RETURNING id INTO receita_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (receita_id, '1.1', 'Prestação de Serviços', 1, '+', true),
            (receita_id, '1.2', 'Outras Receitas Operacionais', 2, '+', true);
    
        -- 2. DEDUÇÕES DA RECEITA BRUTA
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('2', 'DEDUÇÕES DA RECEITA BRUTA', 2, 'soma', false)
        RETURNING id INTO deducoes_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (deducoes_id, '2.1', 'Impostos sobre Serviços', 1, '-', true),
            (deducoes_id, '2.2', 'Devoluções e Abatimentos', 2, '-', true),
            (deducoes_id, '2.3', 'Descontos Comerciais', 3, '-', true);
    
        -- 3. RECEITA LÍQUIDA (Calculado: 1-2)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('3', 'RECEITA LÍQUIDA', 3, 'calculado', '1-2', false)
        RETURNING id INTO receita_liquida_id;
    
        -- 4. CUSTOS
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('4', 'CUSTOS', 4, 'soma', false)
        RETURNING id INTO custos_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (custos_id, '4.1', 'Mão de Obra Direta', 1, '-', true),
            (custos_id, '4.2', 'Materiais Diretos', 2, '-', true),
            (custos_id, '4.3', 'Outros Custos Diretos', 3, '-', true);
    
        -- 5. LUCRO BRUTO (Calculado: 3-4)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('5', 'LUCRO BRUTO', 5, 'calculado', '3-4', false)
        RETURNING id INTO lucro_bruto_id;
    
        -- 6. DESPESAS OPERACIONAIS
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('6', 'DESPESAS OPERACIONAIS', 6, 'soma', false)
        RETURNING id INTO despesas_operacionais_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (despesas_operacionais_id, '6.1', 'Despesas com Vendas', 1, '-', true),
            (despesas_operacionais_id, '6.2', 'Despesas Administrativas', 2, '-', true),
            (despesas_operacionais_id, '6.3', 'Despesas Gerais', 3, '-', true),
            (despesas_operacionais_id, '6.4', 'Despesas com P&D', 4, '-', true);
    
        -- 7. EBITDA (Calculado: 5-6)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('7', 'EBITDA', 7, 'calculado', '5-6', false)
        RETURNING id INTO ebitda_id;
    
        -- 8. DEPRECIAÇÃO E AMORTIZAÇÃO
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('8', 'DEPRECIAÇÃO E AMORTIZAÇÃO', 8, 'soma', false)
        RETURNING id INTO depreciacao_amortizacao_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (depreciacao_amortizacao_id, '8.1', 'Depreciação', 1, '-', true),
            (depreciacao_amortizacao_id, '8.2', 'Amortização', 2, '-', true);
    
        -- 9. EBIT (Calculado: 7-8)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('9', 'EBIT', 9, 'calculado', '7-8', false)
        RETURNING id INTO ebit_id;
    
        -- 10. RESULTADO FINANCEIRO
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('10', 'RESULTADO FINANCEIRO', 10, 'soma', false)
        RETURNING id INTO resultado_financeiro_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (resultado_financeiro_id, '10.1', 'Receitas Financeiras', 1, '+', true),
            (resultado_financeiro_id, '10.2', 'Despesas Financeiras', 2, '-', true);
    
        -- 11. RESULTADO OPERACIONAL (Calculado: 9+10)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('11', 'RESULTADO OPERACIONAL', 11, 'calculado', '9+10', false)
        RETURNING id INTO resultado_operacional_id;
    
        -- 12. OUTRAS RECEITAS E DESPESAS
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('12', 'OUTRAS RECEITAS E DESPESAS', 12, 'soma', false)
        RETURNING id INTO outras_receitas_despesas_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (outras_receitas_despesas_id, '12.1', 'Venda de Ativos', 1, '+', true),
            (outras_receitas_despesas_id, '12.2', 'Resultados Não Recorrentes', 2, '+', true);
    
        -- 13. RESULTADO ANTES DO IR/CS (Calculado: 11+12)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('13', 'RESULTADO ANTES DO IR/CS', 13, 'calculado', '11+12', false)
        RETURNING id INTO resultado_antes_ir_cs_id;
    
        -- 14. PROVISÃO PARA IR E CS
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('14', 'PROVISÃO PARA IR E CS', 14, 'soma', false)
        RETURNING id INTO provisao_ir_cs_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (provisao_ir_cs_id, '14.1', 'Imposto de Renda', 1, '-', true),
            (provisao_ir_cs_id, '14.2', 'Contribuição Social', 2, '-', true);
    
        -- 15. LUCRO LÍQUIDO (Calculado: 13-14)
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, formula, editavel_aluno)
        VALUES ('15', 'LUCRO LÍQUIDO', 15, 'calculado', '13-14', false)
        RETURNING id INTO lucro_liquido_id;
    
        -- 16. INDICADORES
        INSERT INTO public.orcamento_grupos (codigo, nome, ordem, tipo_calculo, editavel_aluno)
        VALUES ('16', 'INDICADORES', 16, 'manual', true)
        RETURNING id INTO indicadores_id;
        
        INSERT INTO public.orcamento_contas (grupo_id, codigo, nome, ordem, sinal, editavel_aluno)
        VALUES 
            (indicadores_id, '16.1', 'Margem Bruta (%)', 1, '+', false),
            (indicadores_id, '16.2', 'Margem EBITDA (%)', 2, '+', false),
            (indicadores_id, '16.3', 'Margem EBIT (%)', 3, '+', false),
            (indicadores_id, '16.4', 'Margem Líquida (%)', 4, '+', false),
            (indicadores_id, '16.5', 'Despesas Operacionais / Receita (%)', 5, '+', false),
            (indicadores_id, '16.6', 'Custo / Receita (%)', 6, '+', false);
    
        -- Inserir indicadores financeiros e suas fórmulas
        INSERT INTO public.orcamento_indicadores (codigo, nome, formula, unidade, ordem)
        VALUES 
            ('MARGEM_BRUTA', 'Margem Bruta', '5/3*100', '%', 1),
            ('MARGEM_EBITDA', 'Margem EBITDA', '7/3*100', '%', 2),
            ('MARGEM_EBIT', 'Margem EBIT', '9/3*100', '%', 3),
            ('MARGEM_LIQUIDA', 'Margem Líquida', '15/3*100', '%', 4),
            ('DESP_RECEITA', 'Despesas Operacionais / Receita', '6/3*100', '%', 5),
            ('CUSTO_RECEITA', 'Custo / Receita', '4/3*100', '%', 6);
    
        -- Adicione um registro de log para verificar a execução bem-sucedida
        RAISE NOTICE 'Plano de contas criado com sucesso pelo admin_create_plano_contas';
    END;
    $function$;
    `;

    // Execute the SQL with enhanced error handling
    console.log("Executing SQL to fix admin_create_plano_contas function");
    
    const { data, error } = await supabaseClient.rpc('exec_sql', { sql });
    
    if (error) {
      console.error("Error executing SQL:", error);
      throw new Error(`Erro ao executar SQL: ${error.message}`);
    }
    
    console.log("SQL executed successfully, data:", data);

    return new Response(
      JSON.stringify({ success: true, message: "Function fixed successfully" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "Erro desconhecido ao corrigir função", 
        time: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
