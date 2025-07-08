
// Simple auth helper functions
export const formatAuthError = (error: any): string => {
  if (!error?.message) return "Erro desconhecido";
  
  if (error.message.includes('Invalid login credentials')) {
    return "Email ou senha inválidos.";
  } else if (error.message.includes('Email not confirmed')) {
    return "Email não confirmado. Verifique sua caixa de entrada.";
  } else if (error.message.includes('Too many requests')) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  
  return error.message;
};

export const getRedirectPath = (userRole: string | undefined): string => {
  if (userRole === 'mentor') {
    return '/mentor';
  }
  return '/dashboard';
};
