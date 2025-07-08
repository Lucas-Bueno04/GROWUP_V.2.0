
import { Session, User } from "@supabase/supabase-js";

export type UserRole = 'aluno' | 'dependente' | 'mentor' | 'admin';

export interface UserWithRole extends Omit<User, 'email'> {
  id: string;
  email: string; // Make email required in our interface
  role: UserRole;
  nome?: string;
}

export interface AuthContextType {
  user: UserWithRole | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getUserProfile: () => Promise<any>;
  refreshUserProfile: () => Promise<UserWithRole | null>;
}
