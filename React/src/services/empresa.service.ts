
import { supabase } from '@/lib/supabase';
import { addEmpresaHistoricoEntry } from '@/lib/create-empresa-historico';

/**
 * Atualiza o status de uma empresa
 * @param params Parâmetros da atualização
 * @returns 
 */
export async function atualizarStatusEmpresa({ id, status, detalhes }: { id: string, status: string, detalhes?: string }) {
  try {
    // Update empresa status
    const { error: updateError } = await supabase
      .from('empresas')
      .update({ status })
      .eq('id', id);
    
    if (updateError) throw updateError;

    // Create history record
    const mensagem = detalhes || `Status alterado para ${status}`;
    await addEmpresaHistoricoEntry(id, mensagem);

    // If status is 'ativo', create chart of accounts for this company
    if (status === 'ativo') {
      try {
        const { data: orcamentoId, error: orcamentoError } = await supabase
          .rpc('criar_plano_contas_para_empresa', { p_empresa_id: id });
        
        if (orcamentoError) {
          console.error("Erro ao criar plano de contas para empresa:", orcamentoError);
        } else {
          console.log(`Plano de contas criado com sucesso para empresa ${id}. Orçamento ID: ${orcamentoId}`);
        }
      } catch (orcamentoCreationError) {
        console.error("Erro ao chamar função de criação de plano de contas:", orcamentoCreationError);
      }
    }

    // Fetch the updated empresa data to return
    const { data: empresa, error: getError } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (getError) throw getError;

    return { success: true, ...empresa };
  } catch (error) {
    console.error('Erro ao atualizar status da empresa:', error);
    return { success: false, error };
  }
}

/**
 * Retorna histÓrico de uma empresa
 * @param empresaId ID da empresa
 */
export async function buscarHistoricoEmpresa(empresaId: string) {
  try {
    const { data, error } = await supabase
      .from('empresa_historico')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar histórico da empresa:', error);
    return { success: false, error };
  }
}

/**
 * Busca todas as empresas
 */
export async function fetchEmpresas() {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    return [];
  }
}

/**
 * Busca empresas por status
 * @param status Status das empresas
 */
export async function fetchEmpresasPorStatus(status: string) {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Erro ao buscar empresas com status ${status}:`, error);
    return [];
  }
}

/**
 * Busca empresa por ID
 * @param id ID da empresa
 */
export async function fetchEmpresaPorId(id: string) {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Erro ao buscar empresa por ID:', error);
    return { success: false, error };
  }
}

/**
 * Cria uma nova empresa
 * @param empresa Dados da empresa
 * @param mentoradoId ID do mentorado (opcional)
 */
export async function criarEmpresa(empresa: any, mentoradoId?: string) {
  try {
    // Insert empresa
    const { data, error } = await supabase
      .from('empresas')
      .insert(empresa)
      .select()
      .single();
      
    if (error) throw error;
    
    // If mentoradoId is provided, create relationship
    if (mentoradoId && data) {
      const { error: relError } = await supabase
        .from('mentorado_empresas')
        .insert({
          mentorado_id: mentoradoId,
          empresa_id: data.id
        });
        
      if (relError) {
        console.error("Erro ao vincular empresa ao mentorado:", relError);
      }
    }
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return { success: false, error };
  }
}

/**
 * Atualiza dados da empresa com informações do CNPJ
 */
export async function atualizarEmpresaComCNPJ(id: string, cnpj: string, consultarCNPJFn: Function) {
  try {
    // Get CNPJ data
    const cnpjData = await consultarCNPJFn(cnpj);
    
    if (!cnpjData) {
      throw new Error('Não foi possível obter os dados do CNPJ');
    }
    
    // Update empresa
    const { data, error } = await supabase
      .from('empresas')
      .update({
        nome: cnpjData.razao_social,
        nome_fantasia: cnpjData.nome_fantasia,
        setor: cnpjData.cnae_fiscal_descricao,
        status: 'ativo',
        endereco: cnpjData.logradouro,
        numero: cnpjData.numero,
        complemento: cnpjData.complemento,
        bairro: cnpjData.bairro,
        cidade: cnpjData.municipio,
        estado: cnpjData.uf,
        cep: cnpjData.cep
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Erro ao atualizar empresa com CNPJ:', error);
    return { success: false, error };
  }
}

/**
 * Exclui uma empresa
 * @param id ID da empresa
 * @param senha Senha para confirmar
 */
export async function excluirEmpresa(id: string, senha: string) {
  try {
    // Get current user password for verification (would be implemented with auth)
    // This is just a placeholder - you'd actually verify the password
    if (senha !== 'senha-admin') {
      throw new Error('Senha incorreta');
    }
    
    // Get empresa data before deletion
    const { data: empresa } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
      
    // Delete empresa
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true, ...empresa };
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    return { success: false, error };
  }
}

/**
 * Formata CNPJ para exibição
 * @param cnpj CNPJ a ser formatado
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove non-numeric characters
  const numericCNPJ = cnpj.replace(/\D/g, '');
  
  // Apply formatting mask: XX.XXX.XXX/XXXX-XX
  return numericCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata data para o formato brasileiro
 * @param date Data a ser formatada
 */
export function formatDateBR(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
