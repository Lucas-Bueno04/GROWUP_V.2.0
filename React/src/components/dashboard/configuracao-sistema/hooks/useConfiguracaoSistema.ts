import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { testarFormula } from '@/hooks/dashboard/formulaEvaluator';
import { checkApiKeyStatus } from '@/lib/secure-storage';
import { validateInput, sanitizeInput, logSecurityEvent } from '@/utils/security';
import { useFaixasFaturamento } from '@/hooks/dashboard/useFaixasFaturamento';
import type { ConfigCalculos, ParametrosIA, CnpjApiStatus } from '../types';

export function useConfiguracaoSistema() {
  // Usar o hook do banco de dados para faixas de faturamento
  const {
    faixas: faixasFaturamentoDB,
    isLoading: isLoadingFaixas,
    updateFaixa,
    createFaixa,
    deleteFaixa
  } = useFaixasFaturamento();

  const [configCalculos, setConfigCalculos] = useState<ConfigCalculos>({
    recalcularAutomatico: true,
    frequenciaCalculoMedias: 'mensal',
    minimoEmpresasPorGrupo: 3,
    precisaoDecimal: 2
  });

  const [parametrosIA, setParametrosIA] = useState<ParametrosIA>({
    confiancaMinima: 75,
    gerarInsightsAutomatico: true,
    categoriasInsights: ['oportunidade', 'alerta', 'recomendacao']
  });

  const [formulaTeste, setFormulaTeste] = useState('(G1 - G2) / G1 * 100');
  const [resultadoTeste, setResultadoTeste] = useState<any>(null);
  const [testando, setTestando] = useState(false);
  const [cnpjApiStatus, setCnpjApiStatus] = useState<CnpjApiStatus>('not-configured');

  // Estado para controlar mudanças não salvas (apenas para localStorage)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<any>(null);

  // Carregar apenas configurações do localStorage (não faixas)
  useEffect(() => {
    loadConfigurations();
    checkCnpjApiStatus();
  }, []);

  const loadConfigurations = () => {
    try {
      const savedConfig = localStorage.getItem('config-sistema');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        if (config.configCalculos) {
          setConfigCalculos({
            recalcularAutomatico: Boolean(config.configCalculos.recalcularAutomatico),
            frequenciaCalculoMedias: config.configCalculos.frequenciaCalculoMedias || 'mensal',
            minimoEmpresasPorGrupo: Number(config.configCalculos.minimoEmpresasPorGrupo) || 3,
            precisaoDecimal: Number(config.configCalculos.precisaoDecimal) || 2
          });
        }
        
        if (config.parametrosIA) {
          setParametrosIA({
            confiancaMinima: Math.max(0, Math.min(100, Number(config.parametrosIA.confiancaMinima) || 75)),
            gerarInsightsAutomatico: Boolean(config.parametrosIA.gerarInsightsAutomatico),
            categoriasInsights: Array.isArray(config.parametrosIA.categoriasInsights) 
              ? config.parametrosIA.categoriasInsights 
              : ['oportunidade', 'alerta', 'recomendacao']
          });
        }
        
        // Salvar configuração original para comparação (sem faixasFaturamento)
        const configLimpo = {
          configCalculos: config.configCalculos,
          parametrosIA: config.parametrosIA
        };
        setOriginalConfig(configLimpo);
        
        logSecurityEvent('CONFIGURATION_LOADED', { hasConfig: true });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      logSecurityEvent('CONFIGURATION_LOAD_ERROR', { error });
      toast({
        title: "Erro ao carregar configurações",
        description: "Usando configurações padrão",
        variant: "destructive"
      });
    }
  };

  const checkCnpjApiStatus = async () => {
    try {
      const { configured } = await checkApiKeyStatus('CNPJ_WS');
      setCnpjApiStatus(configured ? 'configured' : 'not-configured');
    } catch (error) {
      console.error('Erro ao verificar status da API CNPJ:', error);
      setCnpjApiStatus('error');
    }
  };

  // Detectar mudanças não salvas (apenas localStorage)
  useEffect(() => {
    if (!originalConfig) return;

    const currentConfig = {
      configCalculos,
      parametrosIA
    };

    const hasChanges = JSON.stringify(currentConfig) !== JSON.stringify({
      configCalculos: originalConfig.configCalculos,
      parametrosIA: originalConfig.parametrosIA
    });
    setHasUnsavedChanges(hasChanges);
  }, [configCalculos, parametrosIA, originalConfig]);

  // Funções para faixas de faturamento - trabalhar diretamente com o banco
  const adicionarFaixa = () => {
    const ultimaOrdem = Math.max(...faixasFaturamentoDB.map(f => f.ordem), 0);
    createFaixa({
      nome: 'Nova Faixa',
      valor_minimo: 0,
      valor_maximo: 1000000,
      ativa: true,
      ordem: ultimaOrdem + 1,
      imagem_url: null
    });
  };

  const removerFaixa = (id: string) => {
    deleteFaixa(id);
  };

  const atualizarFaixa = (id: string, campo: string, valor: any) => {
    const faixa = faixasFaturamentoDB.find(f => f.id === id);
    if (!faixa) return;

    // Mapear campos da interface para campos do banco
    const campoMapeado = campo === 'valorMinimo' ? 'valor_minimo' : 
                         campo === 'valorMaximo' ? 'valor_maximo' : campo;

    updateFaixa({
      ...faixa,
      [campoMapeado]: valor
    });
  };

  const testarFormulaClick = async () => {
    const sanitizedFormula = sanitizeInput(formulaTeste);
    if (!sanitizedFormula) {
      toast({
        title: "Erro",
        description: "Fórmula não pode estar vazia",
        variant: "destructive"
      });
      return;
    }

    setTestando(true);
    try {
      logSecurityEvent('FORMULA_TEST_ATTEMPT', { formula: sanitizedFormula });
      
      const resultado = await testarFormula(sanitizedFormula);
      setResultadoTeste(resultado);
      
      if (resultado.sucesso) {
        logSecurityEvent('FORMULA_TEST_SUCCESS', { formula: sanitizedFormula });
        toast({
          title: "Fórmula testada com sucesso",
          description: `Resultado: ${resultado.valor.toFixed(2)}`
        });
      } else {
        logSecurityEvent('FORMULA_TEST_FAILED', { formula: sanitizedFormula, error: resultado.erro });
        toast({
          title: "Erro no teste da fórmula",
          description: resultado.erro,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao testar fórmula:', error);
      logSecurityEvent('FORMULA_TEST_ERROR', { formula: sanitizedFormula, error });
      toast({
        title: "Erro ao testar fórmula",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setTestando(false);
    }
  };

  const salvarConfiguracoes = () => {
    try {
      // Salvar apenas configurações que não são do banco (excluindo faixasFaturamento)
      const configToSave = {
        configCalculos: {
          ...configCalculos,
          minimoEmpresasPorGrupo: Math.max(1, configCalculos.minimoEmpresasPorGrupo),
          precisaoDecimal: Math.max(0, Math.min(10, configCalculos.precisaoDecimal))
        },
        parametrosIA: {
          ...parametrosIA,
          confiancaMinima: Math.max(0, Math.min(100, parametrosIA.confiancaMinima))
        }
      };
      
      localStorage.setItem('config-sistema', JSON.stringify(configToSave));
      
      // Atualizar configuração original para nova comparação
      setOriginalConfig(configToSave);
      setHasUnsavedChanges(false);
      
      logSecurityEvent('CONFIGURATION_SAVED', { 
        autoRecalc: configToSave.configCalculos.recalcularAutomatico,
        iaEnabled: configToSave.parametrosIA.gerarInsightsAutomatico
      });
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      logSecurityEvent('CONFIGURATION_SAVE_ERROR', { error });
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    }
  };

  // Converter faixas do banco para o formato esperado pelo componente
  const faixasFormatadas = faixasFaturamentoDB.map(f => ({
    id: f.id,
    nome: f.nome,
    valorMinimo: f.valor_minimo,
    valorMaximo: f.valor_maximo,
    ativa: f.ativa,
    imagem_url: f.imagem_url
  }));

  return {
    faixasFaturamento: faixasFormatadas,
    configCalculos,
    parametrosIA,
    formulaTeste,
    resultadoTeste,
    testando,
    cnpjApiStatus,
    hasUnsavedChanges,
    isLoadingFaixas,
    setConfigCalculos,
    setParametrosIA,
    setFormulaTeste,
    adicionarFaixa,
    removerFaixa,
    atualizarFaixa,
    testarFormulaClick,
    checkCnpjApiStatus,
    salvarConfiguracoes
  };
}
