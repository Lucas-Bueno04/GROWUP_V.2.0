
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { EmpresaSolicitacao } from "@/types/empresa-mentorado.types";
import { removeCNPJFormat, convertToEmpresaDisplay, EmpresaDisplay } from "@/types/empresa.types";

// Function to fetch companies for a mentorado
export const fetchMentoradoEmpresas = async (userId: string, isMentor: boolean = false) => {
  try {
    console.log('fetchMentoradoEmpresas - Fetching for userId:', userId, 'isMentor:', isMentor);
    
    // Se for mentor, busca todas as empresas no sistema
    if (isMentor) {
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select('*');

      if (empresasError) throw empresasError;

      if (empresasData) {
        console.log('fetchMentoradoEmpresas - Mentor access, found empresas:', empresasData.length);
        return empresasData.map(empresa => ({
          id: empresa.id,
          cnpj: empresa.cnpj,
          razaoSocial: empresa.nome,
          nomeFantasia: empresa.nome_fantasia,
          setor: empresa.setor,
          porte: empresa.porte,
          telefone: empresa.telefone,
          site: empresa.site || '',
          situacao: empresa.status === 'ativo' ? 'Ativa' : 
                  empresa.status === 'aguardando' ? 'Aguardando' : 
                  empresa.status === 'recusado' ? 'Recusada' : 'Inativa',
        }));
      } else {
        return [];
      }
    }
    
    // Lógica original para alunos e outros usuários não-mentor
    const { data: mentoradoEmpresas, error } = await supabase
      .from('mentorado_empresas')
      .select('empresa_id')
      .eq('mentorado_id', userId);

    if (error) throw error;

    if (!mentoradoEmpresas || mentoradoEmpresas.length === 0) {
      console.log('fetchMentoradoEmpresas - No companies linked to user:', userId);
      return [];
    }

    const empresaIds = mentoradoEmpresas.map(me => me.empresa_id);
    console.log('fetchMentoradoEmpresas - Found linked company IDs:', empresaIds);

    const { data: empresasData, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .in('id', empresaIds);

    if (empresasError) throw empresasError;

    if (empresasData) {
      console.log('fetchMentoradoEmpresas - Found companies data:', empresasData.length);
      return empresasData.map(empresa => ({
        id: empresa.id,
        cnpj: empresa.cnpj,
        razaoSocial: empresa.nome,
        nomeFantasia: empresa.nome_fantasia,
        setor: empresa.setor,
        porte: empresa.porte,
        telefone: empresa.telefone,
        site: empresa.site || '',
        situacao: empresa.status === 'ativo' ? 'Ativa' : 
                empresa.status === 'aguardando' ? 'Aguardando' : 
                empresa.status === 'recusado' ? 'Recusada' : 'Inativa',
      }));
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching mentorado companies:", error);
    throw error;
  }
};

// Create a new company and link it to the mentorado
export const createAndLinkEmpresa = async (solicitacao: EmpresaSolicitacao) => {
  const cnpjLimpo = removeCNPJFormat(solicitacao.cnpj);
  
  const { data: novaEmpresa, error: novaEmpresaError } = await supabase
    .from('empresas')
    .insert({
      cnpj: cnpjLimpo,
      nome: solicitacao.nome_fantasia, // Using fantasy name as initial name
      nome_fantasia: solicitacao.nome_fantasia,
      telefone: 'Não informado',
      setor: 'Não informado',
      porte: 'Não informado',
      solicitado_por: solicitacao.mentoradoId,
      status: 'aguardando',
      data_solicitacao: new Date().toISOString()
    })
    .select('id')
    .single();

  if (novaEmpresaError) throw novaEmpresaError;

  if (novaEmpresa) {
    await linkMentoradoToEmpresa(solicitacao.mentoradoId, novaEmpresa.id);
  }

  return novaEmpresa;
};

// Link a mentorado to an existing company
export const linkMentoradoToEmpresa = async (mentoradoId: string, empresaId: string) => {
  const { error: vinculoError } = await supabase
    .from('mentorado_empresas')
    .insert({
      mentorado_id: mentoradoId,
      empresa_id: empresaId
    });

  if (vinculoError) throw vinculoError;
};

// Remove link between mentorado and empresa
export const unlinkMentoradoFromEmpresa = async (mentoradoId: string, empresaId: string) => {
  const { error } = await supabase
    .from('mentorado_empresas')
    .delete()
    .eq('empresa_id', empresaId)
    .eq('mentorado_id', mentoradoId);
    
  if (error) throw error;
};

// Search for a company by CNPJ
export const findEmpresaByCNPJ = async (cnpj: string): Promise<EmpresaDisplay | null> => {
  const cnpjLimpo = removeCNPJFormat(cnpj);
  
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('cnpj', cnpjLimpo)
      .maybeSingle();
      
    if (error) throw error;
    
    return data ? convertToEmpresaDisplay(data) : null;
  } catch (error: any) {
    console.error("Error finding company by CNPJ:", error);
    return null;
  }
};
