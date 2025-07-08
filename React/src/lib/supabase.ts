
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Definições das credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rzjdkpnklhlkabkephsx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6amRrcG5rbGhsa2Fia2VwaHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjc2MzgsImV4cCI6MjA2Mjg0MzYzOH0.df_9FpvD1fAhugSLyNNq0FDsKQ1j1oRCYa3h3w_J8hM';

// Cria o cliente Supabase com configurações explícitas para evitar problemas de sessão
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'grow-up-intelligence',
    },
  },
});

// Log para debug - apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('Supabase client initialized with config:', {
    url: supabaseUrl,
    keyLength: supabaseKey?.length || 0,
    hasLocalStorage: typeof localStorage !== 'undefined',
    currentTime: new Date().toISOString()
  });
}

// Função para limpar o estado de autenticação - importante para evitar problemas de auth
export const cleanupAuthState = () => {
  console.log('cleanupAuthState: Iniciando limpeza do estado de auth...');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('cleanupAuthState: Removendo chave:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('cleanupAuthState: Removendo chave de session:', key);
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('cleanupAuthState: Limpeza concluída');
};

// Função para verificar estado da sessão
export const checkSessionHealth = async () => {
  try {
    console.log('checkSessionHealth: Verificando saúde da sessão...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const health = {
      hasSession: !!session,
      hasUser: !!session?.user,
      isExpired: session ? new Date(session.expires_at! * 1000) <= new Date() : true,
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null,
      userId: session?.user?.id,
      error: error?.message
    };
    
    console.log('checkSessionHealth: Resultado:', health);
    return health;
    
  } catch (error) {
    console.error('checkSessionHealth: Erro ao verificar sessão:', error);
    return {
      hasSession: false,
      hasUser: false,
      isExpired: true,
      expiresAt: null,
      userId: null,
      error: (error as Error).message
    };
  }
};
