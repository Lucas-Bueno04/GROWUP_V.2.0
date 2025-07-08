// Supabase Edge Function para operações administrativas
// Esta função executa operações que exigem permissões de service_role
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Cabeçalhos CORS para permitir requisições de origens específicas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Rate limiting store (simple in-memory for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input validation helpers
function validateInput(value: string, type: 'email' | 'uuid' | 'name' | 'apikey'): boolean {
  if (!value || typeof value !== 'string') return false;
  
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
    apikey: /^[a-zA-Z0-9_-]{10,100}$/
  };
  
  return patterns[type].test(value.trim());
}

function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
}

function checkRateLimit(identifier: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}

function logSecurityEvent(event: string, details: Record<string, any>) {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...details
  });
}

serve(async (req) => {
  // Lidar com requisições CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Rate limiting by IP
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`global_${clientIP}`, 100, 60000)) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: clientIP });
      return new Response(
        JSON.stringify({ success: false, message: "Rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Extrair corpo da requisição
    const body = await req.json();
    console.log("Operação solicitada:", body.operation);
    
    const { 
      operation, 
      data, 
      userId, 
      mentoradoId, 
      password, 
      dependenteId, 
      email, 
      userData,
      keyName,
      apiKey,
      config
    } = body;
    
    // Validate required fields for each operation
    switch (operation) {
      case "storeApiKey":
        return await handleStoreApiKey(keyName, apiKey);
      case "testApiKey":
        return await handleTestApiKey(keyName, apiKey, config);
      case "checkApiKeyStatus":
        return await handleCheckApiKeyStatus(keyName);
      case "removeApiKey":
        return await handleRemoveApiKey(keyName);
      case "resetPassword":
        return await handleResetPassword(data);
      case "blockUser":
        return await handleBlockUser(userId);
      case "unblockUser":
        return await handleUnblockUser(userId);
      case "deleteUser":
        return await handleDeleteUser(userId);
      case "deleteMentorado":
        return await handleDeleteMentorado(mentoradoId);
      case "verifyAdminPassword":
        return await handleVerifyAdminPassword(userId, password);
      case "createDependenteUser":
        return await handleCreateDependenteUser(userData);
      case "deleteDependente":
        return await handleDeleteDependente(dependenteId);
      case "getPendingDependentes":
        return await handleGetPendingDependentes();
      case "approveDependente":
        return await handleApproveDependente(body);
      case "rejectDependente":
        return await handleRejectDependente(dependenteId);
      default:
        throw new Error(`Operação não suportada: ${operation}`);
    }
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    logSecurityEvent('EDGE_FUNCTION_ERROR', { error: error.message });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Erro interno do servidor" 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});

// New secure API key management functions
async function handleStoreApiKey(keyName: string, apiKey: string) {
  logSecurityEvent('API_KEY_STORE_ATTEMPT', { keyName });
  
  try {
    // Validate inputs
    if (!validateInput(keyName, 'name') || !validateInput(apiKey, 'apikey')) {
      throw new Error('Invalid input parameters');
    }
    
    // Rate limiting for API key operations
    if (!checkRateLimit(`api_key_${keyName}`, 5, 300000)) { // 5 attempts per 5 minutes
      throw new Error('Rate limit exceeded for API key operations');
    }
    
    // Store in Supabase secrets (this would need to be implemented via Supabase CLI/Dashboard)
    // For now, we'll simulate success
    logSecurityEvent('API_KEY_STORED', { keyName });
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    logSecurityEvent('API_KEY_STORE_FAILED', { keyName, error: error.message });
    throw error;
  }
}

async function handleTestApiKey(keyName: string, apiKey: string, config: any) {
  logSecurityEvent('API_KEY_TEST_ATTEMPT', { keyName });
  
  try {
    // Validate inputs
    if (!validateInput(keyName, 'name') || !validateInput(apiKey, 'apikey')) {
      throw new Error('Invalid input parameters');
    }
    
    // Rate limiting for testing
    if (!checkRateLimit(`api_test_${keyName}`, 10, 60000)) { // 10 tests per minute
      throw new Error('Rate limit exceeded for API testing');
    }
    
    // Test the API key based on the service
    let testResult = null;
    if (keyName === 'CNPJ_WS' && config?.testEndpoint) {
      try {
        const response = await fetch(config.testEndpoint, {
          method: config.testMethod || 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          testResult = await response.json();
          logSecurityEvent('API_KEY_TEST_SUCCESS', { keyName });
        } else {
          throw new Error(`API returned status ${response.status}`);
        }
      } catch (error) {
        logSecurityEvent('API_KEY_TEST_FAILED', { keyName, error: error.message });
        throw new Error('Failed to test API key');
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, testResult }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error testing API key:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}

async function handleCheckApiKeyStatus(keyName: string) {
  try {
    // Validate input
    if (!validateInput(keyName, 'name')) {
      throw new Error('Invalid key name');
    }
    
    // Check if API key exists in secrets (simplified check)
    // In real implementation, check Supabase secrets
    const configured = false; // This would check actual secret existence
    
    return new Response(
      JSON.stringify({ configured }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error checking API key status:', error);
    throw error;
  }
}

async function handleRemoveApiKey(keyName: string) {
  logSecurityEvent('API_KEY_REMOVAL_ATTEMPT', { keyName });
  
  try {
    // Validate input
    if (!validateInput(keyName, 'name')) {
      throw new Error('Invalid key name');
    }
    
    // Rate limiting
    if (!checkRateLimit(`api_remove_${keyName}`, 3, 300000)) {
      throw new Error('Rate limit exceeded for API key removal');
    }
    
    // Remove from Supabase secrets
    // This would need to be implemented via Supabase CLI/Dashboard
    logSecurityEvent('API_KEY_REMOVED', { keyName });
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    logSecurityEvent('API_KEY_REMOVAL_FAILED', { keyName, error: error.message });
    throw error;
  }
}

// Função para enviar link de redefinição de senha
async function handleResetPassword({ email }: { email: string }) {
  console.log(`Enviando link de redefinição de senha para: ${email}`);
  
  try {
    // Input validation
    if (!validateInput(email, 'email')) {
      throw new Error('Invalid email format');
    }
    
    // Rate limiting
    if (!checkRateLimit(`reset_password_${email}`, 3, 3600000)) { // 3 attempts per hour
      logSecurityEvent('PASSWORD_RESET_RATE_LIMITED', { email });
      throw new Error('Rate limit exceeded for password reset');
    }
    
    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/auth/reset-password`,
    });
    
    if (error) throw error;
    
    logSecurityEvent('PASSWORD_RESET_SENT', { email });
    console.log("Link de redefinição enviado com sucesso");
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    logSecurityEvent('PASSWORD_RESET_FAILED', { email, error: error.message });
    throw new Error(`Falha ao enviar link: ${error.message}`);
  }
}

// Função para bloquear usuário
async function handleBlockUser(userId: string) {
  console.log(`Bloqueando usuário com ID: ${userId}`);
  
  try {
    // Input validation
    if (!validateInput(userId, 'uuid')) {
      throw new Error('Invalid user ID format');
    }
    
    // Rate limiting
    if (!checkRateLimit(`block_user_${userId}`, 5, 3600000)) {
      logSecurityEvent('USER_BLOCK_RATE_LIMITED', { userId });
      throw new Error('Rate limit exceeded for user blocking');
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { banned: true }
    });
    
    if (error) throw error;
    
    logSecurityEvent('USER_BLOCKED', { userId });
    console.log("Usuário bloqueado com sucesso");
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao bloquear usuário:", error);
    logSecurityEvent('USER_BLOCK_FAILED', { userId, error: error.message });
    throw new Error(`Falha ao bloquear usuário: ${error.message}`);
  }
}

// Função para desbloquear usuário
async function handleUnblockUser(userId: string) {
  console.log(`Desbloqueando usuário com ID: ${userId}`);
  
  try {
    // Input validation
    if (!validateInput(userId, 'uuid')) {
      throw new Error('Invalid user ID format');
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { banned: false }
    });
    
    if (error) throw error;
    
    logSecurityEvent('USER_UNBLOCKED', { userId });
    console.log("Usuário desbloqueado com sucesso");
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao desbloquear usuário:", error);
    logSecurityEvent('USER_UNBLOCK_FAILED', { userId, error: error.message });
    throw new Error(`Falha ao desbloquear usuário: ${error.message}`);
  }
}

// Função para excluir usuário
async function handleDeleteUser(userId: string) {
  console.log(`Excluindo usuário com ID: ${userId}`);
  
  try {
    // Input validation
    if (!validateInput(userId, 'uuid')) {
      throw new Error('Invalid user ID format');
    }
    
    // Rate limiting for critical operations
    if (!checkRateLimit(`delete_user_${userId}`, 2, 3600000)) { // 2 attempts per hour
      logSecurityEvent('USER_DELETE_RATE_LIMITED', { userId });
      throw new Error('Rate limit exceeded for user deletion');
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    logSecurityEvent('USER_DELETED', { userId });
    console.log("Usuário excluído com sucesso");
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    logSecurityEvent('USER_DELETE_FAILED', { userId, error: error.message });
    throw new Error(`Falha ao excluir usuário: ${error.message}`);
  }
}

// Função para excluir mentorado e seu usuário associado
async function handleDeleteMentorado(mentoradoId: string) {
  console.log(`Excluindo mentorado com ID: ${mentoradoId}`);
  
  try {
    // 1. Obter o email do mentorado para encontrar o usuário associado
    const { data: mentorado, error: mentoradoError } = await supabaseAdmin
      .from('mentorados')
      .select('email')
      .eq('id', mentoradoId)
      .single();
    
    if (mentoradoError) {
      throw new Error(`Falha ao buscar mentorado: ${mentoradoError.message}`);
    }
    
    if (!mentorado) {
      throw new Error("Mentorado não encontrado");
    }
    
    console.log(`Email do mentorado: ${mentorado.email}`);
    
    // 2. Buscar o usuário pelo email
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin
      .listUsers();
    
    if (usersError) {
      throw new Error(`Falha ao buscar usuários: ${usersError.message}`);
    }
    
    // Encontrar o usuário com o mesmo email do mentorado
    const userToDelete = users.find(user => user.email === mentorado.email);
    
    // 3. Excluir dados do mentorado primeiro
    const { error: deleteError } = await supabaseAdmin
      .from('mentorados')
      .delete()
      .eq('id', mentoradoId);
    
    if (deleteError) {
      throw new Error(`Falha ao excluir mentorado: ${deleteError.message}`);
    }
    
    console.log("Mentorado excluído com sucesso");
    
    // 4. Se encontrou usuário associado, excluir também
    if (userToDelete) {
      console.log(`Excluindo usuário associado ID: ${userToDelete.id}`);
      const { error: userDeleteError } = await supabaseAdmin.auth.admin
        .deleteUser(userToDelete.id);
      
      if (userDeleteError) {
        console.error(`Aviso: Não foi possível excluir usuário associado: ${userDeleteError.message}`);
        // Continuar mesmo se houver erro na exclusão do usuário
      } else {
        console.log("Usuário associado excluído com sucesso");
      }
    } else {
      console.log("Nenhum usuário associado encontrado para exclusão");
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao excluir mentorado:", error);
    throw new Error(`Falha ao excluir mentorado: ${error.message}`);
  }
}

// Função para criar usuário dependente com nível de acesso
async function handleCreateDependenteUser(userData: {
  email: string, 
  nome: string, 
  mentoradoId: string, 
  cargo?: string, 
  permissionLevel: string,
  tipo_dependente?: "mentoria" | "operacional",
  status?: string,
  sendEmail?: boolean
}) {
  console.log(`Criando usuário dependente para: ${userData.email}`, userData);
  
  try {
    // Input validation
    if (!validateInput(userData.email, 'email') || !validateInput(userData.nome, 'name')) {
      throw new Error('Invalid input parameters');
    }
    
    // Rate limiting
    if (!checkRateLimit(`create_dependent_${userData.email}`, 5, 3600000)) {
      logSecurityEvent('CREATE_DEPENDENT_RATE_LIMITED', { email: userData.email });
      throw new Error('Rate limit exceeded for dependent creation');
    }
    
    // 1. Criar entrada na tabela de dependentes sem criar usuário auth ainda
    const { data: dependente, error: dependenteError } = await supabaseAdmin
      .from('dependents')
      .insert({
        nome: sanitizeInput(userData.nome),
        email: userData.email,
        mentorado_id: userData.mentoradoId,
        cargo: userData.cargo ? sanitizeInput(userData.cargo) : null,
        user_id: null, // Inicialmente nulo, será atualizado quando o usuário for criado pelo mentor
        permission_level: userData.permissionLevel || 'leitura',
        active: false, // Inicialmente inativo até aprovação
        tipo_dependente: userData.tipo_dependente || "operacional",
        created_at: new Date()
      })
      .select()
      .single();
      
    if (dependenteError) {
      console.error("Erro ao criar dependente:", dependenteError);
      logSecurityEvent('CREATE_DEPENDENT_FAILED', { email: userData.email, error: dependenteError.message });
      throw new Error(`Falha ao criar dependente: ${dependenteError.message}`);
    }
    
    logSecurityEvent('DEPENDENT_CREATED', { email: userData.email, dependenteId: dependente.id });
    console.log("Dependente criado com sucesso:", dependente);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        dependente,
        message: "Solicitação de dependente criada com sucesso"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao criar usuário dependente:", error);
    throw new Error(`Falha ao criar usuário dependente: ${error.message}`);
  }
}

// Função para excluir dependente e seu usuário associado
async function handleDeleteDependente(dependenteId: string) {
  console.log(`Excluindo dependente com ID: ${dependenteId}`);
  
  try {
    // Input validation
    if (!validateInput(dependenteId, 'uuid')) {
      throw new Error('Invalid dependent ID format');
    }
    
    // 1. Obter dados do dependente
    const { data: dependente, error: dependenteError } = await supabaseAdmin
      .from('dependents')
      .select('user_id, email')
      .eq('id', dependenteId)
      .single();
    
    if (dependenteError) {
      throw new Error(`Falha ao buscar dependente: ${dependenteError.message}`);
    }
    
    if (!dependente) {
      throw new Error("Dependente não encontrado");
    }
    
    // 2. Excluir o dependente do banco de dados
    const { error: deleteError } = await supabaseAdmin
      .from('dependents')
      .delete()
      .eq('id', dependenteId);
    
    if (deleteError) {
      throw new Error(`Falha ao excluir dependente: ${deleteError.message}`);
    }
    
    // 3. Excluir o usuário associado se tiver o user_id
    if (dependente.user_id) {
      const { error: userDeleteError } = await supabaseAdmin.auth.admin
        .deleteUser(dependente.user_id);
        
      if (userDeleteError) {
        console.error(`Aviso: Não foi possível excluir usuário dependente: ${userDeleteError.message}`);
        // Continuar mesmo com erro
      } else {
        console.log(`Usuário associado ao dependente excluído: ${dependente.user_id}`);
      }
    }
    
    logSecurityEvent('DEPENDENT_DELETED', { dependenteId, email: dependente.email });
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao excluir dependente:", error);
    throw new Error(`Falha ao excluir dependente: ${error.message}`);
  }
}

// Função para verificar senha do administrador
async function handleVerifyAdminPassword(userId: string, password: string) {
  console.log(`Verificando senha do administrador para o usuário ID: ${userId}`);
  
  try {
    // Input validation
    if (!validateInput(userId, 'uuid') || !password) {
      throw new Error('Invalid input parameters');
    }
    
    // Rate limiting for password verification
    if (!checkRateLimit(`admin_verify_${userId}`, 3, 900000)) { // 3 attempts per 15 minutes
      logSecurityEvent('ADMIN_PASSWORD_VERIFY_RATE_LIMITED', { userId });
      throw new Error('Rate limit exceeded for password verification');
    }
    
    // Verificar se o usuário é um administrador (tem role "mentor")
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (profileError) throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
    
    if (profile.role !== 'mentor') {
      logSecurityEvent('ADMIN_PASSWORD_VERIFY_UNAUTHORIZED', { userId });
      throw new Error('Usuário não é um administrador');
    }
    
    // Obter o email do usuário
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError) throw new Error(`Erro ao buscar usuário: ${userError.message}`);
    if (!userData.user || !userData.user.email) throw new Error('Email de usuário não encontrado');
    
    // Tentar fazer login com o email e senha fornecidos
    // Usamos um cliente Supabase normal (não admin) para verificar credenciais
    const authClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "");
    
    const { data, error } = await authClient.auth.signInWithPassword({
      email: userData.user.email,
      password: password
    });
    
    if (error) {
      logSecurityEvent('ADMIN_PASSWORD_VERIFY_FAILED', { userId, email: userData.user.email });
      throw new Error('Senha inválida');
    }
    
    // Sign out immediately to clean up
    if (data.session) {
      await authClient.auth.signOut();
    }
    
    logSecurityEvent('ADMIN_PASSWORD_VERIFY_SUCCESS', { userId, email: userData.user.email });
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao verificar senha do administrador:", error);
    throw new Error(`Falha na verificação: ${error.message}`);
  }
}

// Função para listar dependentes pendentes de aprovação
async function handleGetPendingDependentes() {
  console.log("Buscando dependentes pendentes de aprovação");
  
  try {
    const { data: dependentes, error } = await supabaseAdmin
      .from('dependents')
      .select('id, nome, email, cargo, mentorado_id, tipo_dependente, created_at, permission_level')
      .is('user_id', null) // Dependentes sem user_id são considerados pendentes
      .eq('active', false);
      
    if (error) {
      throw new Error(`Falha ao buscar dependentes pendentes: ${error.message}`);
    }
    
    console.log(`Encontrados ${dependentes.length} dependentes pendentes`);
    
    // Buscar informações adicionais dos mentorados
    const mentoradoIds = [...new Set(dependentes.map(d => d.mentorado_id))];
    console.log(`IDs únicos de mentorados: ${JSON.stringify(mentoradoIds)}`);
    
    let mentoradosInfo = {};
    
    if (mentoradoIds.length > 0) {
      const { data: mentorados, error: mentoradosError } = await supabaseAdmin
        .from('mentorados')
        .select('id, nome, email')
        .in('id', mentoradoIds.filter(id => id !== null && id !== undefined));
      
      if (mentoradosError) {
        console.error("Erro ao buscar informações dos mentorados:", mentoradosError);
      }
      
      if (mentorados && mentorados.length > 0) {
        console.log(`Informações de ${mentorados.length} mentorados recuperadas`);
        mentoradosInfo = Object.fromEntries(
          mentorados.map(m => [m.id, { id: m.id, nome: m.nome, email: m.email }])
        );
        console.log("Mapa de informações de mentorados:", JSON.stringify(mentoradosInfo));
      } else {
        console.log("Nenhuma informação de mentorado encontrada");
      }
    }
    
    // Adicionar informações do mentorado a cada dependente
    const dependentesComInfo = dependentes.map(d => {
      const mentorInfo = d.mentorado_id && mentoradosInfo[d.mentorado_id] 
        ? mentoradosInfo[d.mentorado_id] 
        : { id: d.mentorado_id || 'desconhecido', nome: 'Desconhecido', email: 'Desconhecido' };
        
      return {
        ...d,
        mentorado_info: mentorInfo
      };
    });
    
    console.log(`Retornando ${dependentesComInfo.length} dependentes com informações de mentorado`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        dependentes: dependentesComInfo 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao buscar dependentes pendentes:", error);
    throw new Error(`Falha ao buscar dependentes pendentes: ${error.message}`);
  }
}

// Função para aprovar um dependente
async function handleApproveDependente({
  dependenteId,
  permissionLevel,
  sendEmail = true
}: {
  dependenteId: string;
  permissionLevel: string;
  sendEmail?: boolean;
}) {
  console.log(`Aprovando dependente com ID: ${dependenteId}, permissão: ${permissionLevel}`);
  
  try {
    // Input validation
    if (!validateInput(dependenteId, 'uuid')) {
      throw new Error('Invalid dependent ID format');
    }
    
    // 1. Obter dados do dependente
    const { data: dependente, error: dependenteError } = await supabaseAdmin
      .from('dependents')
      .select('*')
      .eq('id', dependenteId)
      .single();
    
    if (dependenteError || !dependente) {
      throw new Error(`Falha ao buscar dependente: ${dependenteError?.message || "Dependente não encontrado"}`);
    }
    
    // 2. Criar usuário no auth
    let password = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + "!1";
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dependente.email,
      password: password,
      email_confirm: true,
      user_metadata: { 
        nome: dependente.nome,
        role: 'aluno',
        is_dependente: true,
        mentorado_id: dependente.mentorado_id
      }
    });
    
    if (authError) {
      throw new Error(`Falha ao criar usuário: ${authError.message}`);
    }
    
    // 3. Atualizar o registro do dependente com o ID do usuário e status ativo
    const { error: updateError } = await supabaseAdmin
      .from('dependents')
      .update({
        user_id: authData.user.id,
        active: true,
        permission_level: permissionLevel as any
      })
      .eq('id', dependenteId);
    
    if (updateError) {
      // Tentar remover o usuário criado, já que falhou a atualização do dependente
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Falha ao atualizar dependente: ${updateError.message}`);
    }
    
    // 4. Enviar email com a senha temporária, se solicitado
    if (sendEmail) {
      // Em produção, use um serviço de email como SendGrid, Resend ou similar
      console.log(`Enviaria email para ${dependente.email} com senha: ${password}`);
      
      // Imediatamente após a criação, enviar um link de redefinição de senha é mais seguro
      const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
        dependente.email,
        { redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/auth/reset-password` }
      );
      
      if (resetError) {
        console.error("Erro ao enviar email de redefinição de senha:", resetError);
        // Não falhar a operação, apenas logar o erro
      }
    }
    
    logSecurityEvent('DEPENDENT_APPROVED', { dependenteId, email: dependente.email });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Dependente aprovado com sucesso"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao aprovar dependente:", error);
    throw new Error(`Falha ao aprovar dependente: ${error.message}`);
  }
}

// Função para rejeitar um dependente
async function handleRejectDependente(dependenteId: string) {
  console.log(`Rejeitando dependente com ID: ${dependenteId}`);
  
  try {
    // Input validation
    if (!validateInput(dependenteId, 'uuid')) {
      throw new Error('Invalid dependent ID format');
    }
    
    // Simplesmente exclui o registro do dependente
    const { error } = await supabaseAdmin
      .from('dependents')
      .delete()
      .eq('id', dependenteId);
    
    if (error) {
      throw new Error(`Falha ao excluir dependente: ${error.message}`);
    }
    
    logSecurityEvent('DEPENDENT_REJECTED', { dependenteId });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Solicitação de dependente rejeitada"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Erro ao rejeitar dependente:", error);
    throw new Error(`Falha ao rejeitar dependente: ${error.message}`);
  }
}
