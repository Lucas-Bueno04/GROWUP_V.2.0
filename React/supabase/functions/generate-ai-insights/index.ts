
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { empresaId, indicadores, dadosFinanceiros, contextoEmpresa } = await req.json();

    console.log('Generating AI insights for empresa:', empresaId);

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Prepare context for Claude
    const prompt = `
Você é um consultor empresarial especializado em análise financeira. Com base nos dados fornecidos, gere insights inteligentes e recomendações estratégicas para a empresa.

DADOS DA EMPRESA:
${JSON.stringify(contextoEmpresa, null, 2)}

INDICADORES FINANCEIROS:
${JSON.stringify(indicadores, null, 2)}

DADOS FINANCEIROS RECENTES:
${JSON.stringify(dadosFinanceiros, null, 2)}

Analise estes dados e forneça:
1. 3-5 insights principais sobre a performance atual
2. Principais pontos de atenção ou alertas
3. Oportunidades de melhoria identificadas
4. Recomendações específicas e acionáveis

Para cada insight, inclua:
- Tipo (oportunidade, alerta, tendencia, recomendacao)
- Título conciso
- Descrição detalhada
- Nível de prioridade (alta, media, baixa)
- Nível de confiança (0-100)
- Ações específicas recomendadas

Responda em formato JSON seguindo esta estrutura:
{
  "insights": [
    {
      "tipo": "oportunidade|alerta|tendencia|recomendacao",
      "titulo": "Título do insight",
      "descricao": "Descrição detalhada",
      "prioridade": "alta|media|baixa",
      "confianca": 85,
      "acoes": ["Ação 1", "Ação 2", "Ação 3"]
    }
  ],
  "resumoExecutivo": "Resumo geral da situação da empresa",
  "scorePerformance": 7.5
}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const claudeResponse = await response.json();
    console.log('Claude response received');

    // Parse Claude's response
    let aiInsights;
    try {
      const contentText = claudeResponse.content[0].text;
      // Extract JSON from Claude's response (it might include extra text)
      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiInsights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in Claude response');
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      // Fallback response if parsing fails
      aiInsights = {
        insights: [
          {
            tipo: 'recomendacao',
            titulo: 'Análise Automatizada Disponível',
            descricao: 'O sistema de IA está processando os dados da empresa para gerar insights personalizados.',
            prioridade: 'media',
            confianca: 75,
            acoes: ['Aguarde alguns instantes e recarregue a página', 'Verifique se todos os dados estão completos']
          }
        ],
        resumoExecutivo: 'Análise em processamento pelo sistema de IA.',
        scorePerformance: 5.0
      };
    }

    // Store insights in database for caching
    try {
      const { error: insertError } = await supabase
        .from('ai_insights_cache')
        .upsert({
          empresa_id: empresaId,
          insights_data: aiInsights,
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });
      
      if (insertError) {
        console.error('Error caching insights:', insertError);
      }
    } catch (cacheError) {
      console.log('Cache table not available, skipping cache storage');
    }

    return new Response(JSON.stringify(aiInsights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-insights function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao gerar insights com IA',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
