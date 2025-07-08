
import { supabase } from '@/lib/supabase';
import { Mentorado } from '@/types/mentorado';

/**
 * Função para buscar todos os mentorados
 */
export const fetchMentorados = async (): Promise<Mentorado[]> => {
  try {
    console.log("Buscando todos os mentorados...");
    const { data, error } = await supabase
      .from('mentorados')
      .select('*')
      .order('nome');

    if (error) {
      console.error("Erro ao buscar mentorados:", error);
      throw new Error(error.message);
    }

    console.log("Mentorados recebidos:", data);
    
    if (!data || data.length === 0) {
      console.log("Nenhum mentorado encontrado, retornando lista vazia");
      return [];
    }

    // Garantir que todos os mentorados são incluídos na lista, independente do papel
    return data.map((item) => ({
      id: item.id,
      nome: item.nome,
      email: item.email,
      cpf: item.cpf || '',
      telefone: item.telefone || '',
      dataNascimento: item.data_nascimento || '',
      status: item.status || 'ativo',
      empresa: item.empresa || ''
    }));
  } catch (error) {
    console.error("Erro ao buscar mentorados:", error);
    throw error;
  }
};

/**
 * Função para buscar um mentorado por email
 */
export const fetchMentoradoPorEmail = async (email: string): Promise<Mentorado | null> => {
  if (!email) {
    console.warn("Email inválido fornecido para busca de mentorado");
    return null;
  }

  try {
    console.log(`Buscando mentorado com email: ${email}`);
    
    const { data, error } = await supabase
      .from('mentorados')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar mentorado por email:", error);
      return null;
    }

    if (!data) {
      console.log("Nenhum mentorado encontrado com este email");
      return null;
    }

    console.log("Mentorado encontrado:", data);

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      cpf: data.cpf || '',
      telefone: data.telefone || '',
      dataNascimento: data.data_nascimento || '',
      status: data.status || 'ativo',
      empresa: data.empresa || ''
    };
  } catch (error) {
    console.error("Erro ao buscar mentorado por email:", error);
    return null;
  }
};

/**
 * Função para buscar um mentorado por ID
 */
export const fetchMentoradoPorId = async (id: string): Promise<Mentorado | null> => {
  if (!id || typeof id !== 'string') {
    console.warn("ID inválido fornecido para busca de mentorado:", id);
    return null;
  }

  try {
    console.log(`Buscando mentorado com ID: ${id}`);
    
    const { data, error } = await supabase
      .from('mentorados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Erro ao buscar mentorado por ID:", error);
      return null;
    }

    if (!data) {
      console.log("Nenhum mentorado encontrado com este ID");
      return null;
    }

    console.log("Mentorado encontrado:", data);

    // Buscar empresas associadas ao mentorado
    const { data: empresaData, error: empresaError } = await supabase
      .from('mentorado_empresas')
      .select('empresas(*)')
      .eq('mentorado_id', id)
      .limit(1);

    if (empresaError) {
      console.error('Erro ao buscar empresas do mentorado:', empresaError);
    }

    let empresaNome = data.empresa || '';
    
    // Verificar se temos dados e acessar corretamente a estrutura
    if (empresaData && empresaData.length > 0 && empresaData[0]?.empresas) {
      const empresaInfo = empresaData[0].empresas;
      if (empresaInfo && typeof empresaInfo === 'object' && 'nome' in empresaInfo) {
        empresaNome = empresaInfo.nome as string;
      }
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      cpf: data.cpf || '',
      telefone: data.telefone || '',
      dataNascimento: data.data_nascimento || '',
      status: data.status || 'ativo',
      empresa: empresaNome
    };
  } catch (error) {
    console.error("Erro ao buscar mentorado por ID:", error);
    return null;
  }
};

/**
 * Função para criar um novo mentorado
 */
export const criarMentorado = async (mentorado: Omit<Mentorado, 'id'>) => {
  const { data, error } = await supabase
    .from('mentorados')
    .insert({
      nome: mentorado.nome,
      email: mentorado.email,
      cpf: mentorado.cpf,
      telefone: mentorado.telefone,
      data_nascimento: mentorado.dataNascimento,
      status: mentorado.status,
      empresa: mentorado.empresa
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Função para atualizar um mentorado
 */
export const atualizarMentorado = async (mentorado: Mentorado) => {
  const { data, error } = await supabase
    .from('mentorados')
    .update({
      nome: mentorado.nome,
      email: mentorado.email,
      cpf: mentorado.cpf,
      telefone: mentorado.telefone,
      data_nascimento: mentorado.dataNascimento,
      status: mentorado.status,
      empresa: mentorado.empresa
    })
    .eq('id', mentorado.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
