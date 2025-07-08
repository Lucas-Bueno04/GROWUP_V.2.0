
import { UserWithRole } from "./types";

// Simple utility functions for auth
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getUserDisplayName = (user: UserWithRole | null): string => {
  if (!user) return 'Usuário';
  return user.nome || user.email?.split('@')[0] || 'Usuário';
};

export const isUserMentor = (user: UserWithRole | null): boolean => {
  return user?.role === 'mentor';
};

export const isUserStudent = (user: UserWithRole | null): boolean => {
  return user?.role === 'aluno';
};
