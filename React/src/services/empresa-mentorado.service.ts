
import { supabase } from '@/lib/supabase';
import { Empresa } from '@/types/empresa.types';

// Interface for empresa data returned by the service
export interface EmpresaMentorado {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  setor: string;
  porte: string;
  site: string | null;
  situacao: string;
  telefone: string;
}

// Interface for empresa solicitation
export interface EmpresaSolicitacao {
  cnpj: string;
  mentoradoId: string;
  justificativa?: string;
}

// Fetch empresas for a mentorado
export const fetchEmpresasMentoradoService = async (mentoradoId: string): Promise<EmpresaMentorado[]> => {
  console.log("Buscando empresas para o mentorado:", mentoradoId);
  
  // Buscar empresas do mentorado através do relacionamento
  const { data: empresasData, error: empresasError } = await supabase
    .from('mentorado_empresas')
    .select(`
      empresa_id,
      empresas (
        id,
        nome,
        nome_fantasia,
        cnpj,
        setor,
        porte,
        site,
        status,
        telefone
      )
    `)
    .eq('mentorado_id', mentoradoId);
    
  if (empresasError) {
    console.error("Erro ao buscar empresas do mentorado:", empresasError);
    throw empresasError;
  }
  
  if (!empresasData || empresasData.length === 0) {
    console.log("Nenhuma empresa encontrada para este mentorado");
    return [];
  }
  
  // Mapear os dados para o formato esperado pelo componente
  return empresasData.map(item => {
    const empresaInfo = item.empresas as any;
    return {
      id: empresaInfo.id,
      razaoSocial: empresaInfo.nome,
      nomeFantasia: empresaInfo.nome_fantasia,
      cnpj: empresaInfo.cnpj,
      setor: empresaInfo.setor,
      porte: empresaInfo.porte,
      site: empresaInfo.site,
      situacao: empresaInfo.status === 'ativo' ? 'Ativa' : 
               empresaInfo.status === 'recusado' ? 'Recusada' : 'Aguardando',
      telefone: empresaInfo.telefone
    };
  });
};

// Function to get mentorado ID from user email
export const getMentoradoIdFromEmail = async (email: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('mentorados')
    .select('id')
    .eq('email', email)
    .single();
    
  if (error) {
    console.error("Erro ao buscar mentorado:", error);
    return null;
  }
  
  return data?.id || null;
};

// Function to check if this is the first company for a mentorado
export const isFirstCompanyForMentorado = async (mentoradoId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('mentorado_empresas')
    .select('id', { count: 'exact', head: true })
    .eq('mentorado_id', mentoradoId);
    
  if (error) {
    console.error("Erro ao verificar se é a primeira empresa:", error);
    return false;
  }
  
  return !data || data.length === 0;
};

// Solicitar nova empresa
export const solicitarNovaEmpresaService = async (solicitacao: EmpresaSolicitacao): Promise<{ 
  success: boolean;
  message: string;
  isFirstCompany?: boolean;
}> => {
  const mentoradoId = solicitacao.mentoradoId;
  
  if (!mentoradoId) {
    throw new Error("ID do mentorado não fornecido");
  }

  // Buscar dados do mentorado
  const { data: mentoradoData, error: mentoradoError } = await supabase
    .from('mentorados')
    .select('id, nome')
    .eq('id', mentoradoId)
    .single();
    
  if (mentoradoError) {
    throw mentoradoError;
  }

  // Verificar se a empresa já existe no banco
  const { data: empresaExistente, error: empresaError } = await supabase
    .from('empresas')
    .select('id, status')
    .eq('cnpj', solicitacao.cnpj)
    .maybeSingle();
    
  if (empresaError && empresaError.code !== 'PGRST116') {
    throw empresaError;
  }
  
  // Se a empresa já existe, verificar se já está vinculada ao mentorado
  if (empresaExistente?.id) {
    const { data: vinculoExistente, error: vinculoError } = await supabase
      .from('mentorado_empresas')
      .select('id')
      .eq('mentorado_id', mentoradoId)
      .eq('empresa_id', empresaExistente.id)
      .maybeSingle();
      
    if (vinculoError && vinculoError.code !== 'PGRST116') {
      throw vinculoError;
    }
    
    if (vinculoExistente?.id) {
      throw new Error("Esta empresa já está vinculada ao seu perfil");
    }
    
    // Se a empresa existe mas não está vinculada ao mentorado, criar apenas o vínculo
    const { error: novoVinculoError } = await supabase
      .from('mentorado_empresas')
      .insert({
        mentorado_id: mentoradoId,
        empresa_id: empresaExistente.id
      });
      
    if (novoVinculoError) {
      throw novoVinculoError;
    }
    
    return { success: true, message: "Empresa existente vinculada com sucesso" };
  }
  
  // Verificar se este é o primeiro cadastro de empresa do mentorado
  const isFirstCompany = await isFirstCompanyForMentorado(mentoradoId);
  
  // Determinar o status baseado na contagem de empresas
  const novoStatus = isFirstCompany ? 'ativo' : 'aguardando';
  const mensagemSolicitacao = isFirstCompany ? 
    "Primeira empresa cadastrada automaticamente" : 
    "Aguardando autorização do mentor";
  
  // Inserir a solicitação de nova empresa
  const { data: novaEmpresa, error: novaEmpresaError } = await supabase
    .from('empresas')
    .insert({
      cnpj: solicitacao.cnpj,
      nome: isFirstCompany ? "Empresa do Mentorado" : "Aguardando autorização",
      nome_fantasia: isFirstCompany ? "Empresa do Mentorado" : "Aguardando autorização",
      setor: isFirstCompany ? "A confirmar" : "A confirmar",
      porte: isFirstCompany ? "A confirmar" : "A confirmar",
      status: novoStatus,
      solicitado_por: mentoradoData.nome,
      telefone: "A confirmar",
      data_solicitacao: new Date().toISOString()
    })
    .select('id')
    .single();
    
  if (novaEmpresaError) {
    throw novaEmpresaError;
  }
  
  // Criar o vínculo entre o mentorado e a empresa
  const { error: vinculoError } = await supabase
    .from('mentorado_empresas')
    .insert({
      mentorado_id: mentoradoId,
      empresa_id: novaEmpresa.id
    });
    
  if (vinculoError) {
    throw vinculoError;
  }

  // Se for a primeira empresa, criar um alerta de boas-vindas
  if (isFirstCompany) {
    await supabase
      .from('alerts')
      .insert({
        mentorado_id: mentoradoId,
        title: 'Empresa cadastrada automaticamente',
        description: 'Sua primeira empresa foi cadastrada automaticamente. Complete os dados dela na seção de empresas.',
        alert_type: 'notificacao',
        priority: 'baixa'
      });
  }
  
  return { 
    success: true, 
    message: isFirstCompany ? "Empresa cadastrada automaticamente" : "Nova empresa solicitada com sucesso",
    isFirstCompany 
  };
};

// Reconhecer uma empresa recusada (remover da lista do mentorado)
export const reconhecerEmpresaRecusadaService = async (empresaId: string, mentoradoId: string): Promise<boolean> => {
  // Remover o vínculo entre o mentorado e a empresa recusada
  const { error } = await supabase
    .from('mentorado_empresas')
    .delete()
    .eq('mentorado_id', mentoradoId)
    .eq('empresa_id', empresaId);
    
  if (error) {
    throw error;
  }
  
  return true;
};
