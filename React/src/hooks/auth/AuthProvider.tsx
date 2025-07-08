
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthContextType, UserWithRole } from "./types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth functions
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { nome: name, name: name }
      }
    });
    if (error) throw error;
    return { data, error: null };
  };

  const signOut = async () => {
    console.log('AuthProvider: Iniciando logout...');
    
    // Limpar estado primeiro
    setUser(null);
    setSession(null);
    
    try {
      // Tentar logout global
      await supabase.auth.signOut({ scope: 'global' });
      console.log('AuthProvider: Logout realizado com sucesso');
    } catch (error) {
      console.error('AuthProvider: Erro no logout:', error);
    }
    
    // Limpar localStorage de tokens de auth
    cleanupAuthState();
    
    // Forçar redirecionamento
    window.location.href = '/';
  };

  // Compatibilidade
  const refreshUser = async () => {};
  const getUserProfile = async () => user;
  const refreshUserProfile = async () => user;

  // Função para limpar estado de autenticação
  const cleanupAuthState = () => {
    console.log('AuthProvider: Limpando estado de autenticação...');
    
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('AuthProvider: Removendo chave:', key);
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Função para buscar perfil do usuário com retry e validação
  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('AuthProvider: Buscando perfil do usuário:', userId, 'tentativa:', retryCount + 1);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, nome')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthProvider: Erro ao buscar perfil:', error);
        
        // Se for erro de "não encontrado" e for a primeira tentativa, 
        // tentar criar o perfil baseado na sessão
        if (error.code === 'PGRST116' && retryCount === 0) {
          console.log('AuthProvider: Perfil não encontrado, tentando criar...');
          
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.user) {
            const sessionUser = session.session.user;
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                nome: sessionUser.user_metadata?.nome || sessionUser.user_metadata?.name || 'Usuário',
                email: sessionUser.email || 'no-email',
                role: 'aluno'
              });
            
            if (!insertError) {
              console.log('AuthProvider: Perfil criado com sucesso, buscando novamente...');
              return await fetchUserProfile(userId, retryCount + 1);
            } else {
              console.error('AuthProvider: Erro ao criar perfil:', insertError);
            }
          }
        }
        
        return null;
      }

      console.log('AuthProvider: Perfil encontrado:', profile);
      
      // Validar se o perfil tem dados essenciais
      if (!profile.role) {
        console.warn('AuthProvider: Perfil encontrado mas sem role, atualizando...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'aluno' })
          .eq('id', userId);
          
        if (!updateError) {
          return { ...profile, role: 'aluno' };
        }
      }
      
      return profile;
    } catch (error) {
      console.error('AuthProvider: Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  // Função para processar sessão e buscar perfil
  const processSession = async (session: Session | null) => {
    console.log('AuthProvider: Processando sessão:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    if (session?.user) {
      console.log('AuthProvider: Usuário encontrado na sessão, buscando perfil...');
      
      // Usar setTimeout para evitar deadlocks
      setTimeout(async () => {
        try {
          // Buscar perfil do banco de dados com retry
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            // Criar usuário com dados do perfil
            const userWithRole: UserWithRole = {
              ...session.user,
              email: session.user.email || 'no-email',
              role: profile.role || 'aluno',
              nome: profile.nome || session.user.user_metadata?.nome || session.user.user_metadata?.name || 'Usuário'
            };
            
            console.log('AuthProvider: Usuário processado com role:', userWithRole.role);
            setUser(userWithRole);
          } else {
            // Se não conseguiu buscar/criar perfil, usar dados básicos da sessão
            console.log('AuthProvider: Não foi possível obter perfil, usando dados da sessão');
            const userWithRole: UserWithRole = {
              ...session.user,
              email: session.user.email || 'no-email',
              role: 'aluno',
              nome: session.user.user_metadata?.nome || session.user.user_metadata?.name || 'Usuário'
            };
            
            setUser(userWithRole);
          }
        } catch (error) {
          console.error('AuthProvider: Erro ao processar perfil do usuário:', error);
          
          // Fallback para dados básicos da sessão
          const userWithRole: UserWithRole = {
            ...session.user,
            email: session.user.email || 'no-email',
            role: 'aluno',
            nome: session.user.user_metadata?.nome || session.user.user_metadata?.name || 'Usuário'
          };
          
          setUser(userWithRole);
        }
      }, 0);
      
      setSession(session);
    } else {
      console.log('AuthProvider: Nenhum usuário na sessão');
      setUser(null);
      setSession(null);
    }
    
    setLoading(false);
  };

  // Função para verificar e refreshar sessão
  const checkAndRefreshSession = async () => {
    try {
      console.log('AuthProvider: Verificando e refreshando sessão...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider: Erro ao obter sessão:', error);
        setLoading(false);
        return;
      }
      
      console.log('AuthProvider: Sessão obtida:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });
      
      await processSession(session);
      
    } catch (error) {
      console.error('AuthProvider: Erro inesperado ao verificar sessão:', error);
      setLoading(false);
    }
  };

  // Inicialização
  useEffect(() => {
    console.log('AuthProvider: Iniciando configuração de autenticação...');
    
    // Configurar listener de mudanças de auth PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state change:', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      });
      
      // Para eventos que não sejam TOKEN_REFRESHED, reprocessar a sessão
      if (event !== 'TOKEN_REFRESHED') {
        await processSession(session);
      } else {
        // Para TOKEN_REFRESHED, apenas atualizar a sessão
        setSession(session);
      }
    });

    // DEPOIS verificar sessão inicial
    checkAndRefreshSession();

    return () => {
      console.log('AuthProvider: Removendo subscription de auth');
      subscription.unsubscribe();
    };
  }, []);

  // Auto-refresh da sessão a cada 5 minutos se há usuário logado
  useEffect(() => {
    if (!user) return;
    
    const refreshInterval = setInterval(async () => {
      try {
        console.log('AuthProvider: Auto-refresh da sessão...');
        const { data: { session }, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('AuthProvider: Erro no auto-refresh:', error);
        } else {
          console.log('AuthProvider: Sessão refreshada automaticamente');
          setSession(session);
        }
      } catch (error) {
        console.error('AuthProvider: Erro inesperado no auto-refresh:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(refreshInterval);
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
    getUserProfile,
    refreshUserProfile,
  };

  console.log('AuthProvider: Rendering with state:', {
    loading,
    hasUser: !!user,
    userRole: user?.role,
    hasSession: !!session,
    sessionValid: !!(session && new Date(session.expires_at! * 1000) > new Date())
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
