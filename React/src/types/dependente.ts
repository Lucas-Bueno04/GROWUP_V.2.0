
export interface DependenteInfo {
  id: string;
  created_at: string;
  email: string;
  nome: string;
  cargo: string | null;
  permission_level: "leitura" | "escrita_basica" | "escrita_completa" | "admin";
  mentorado_id: string;
  mentorado_info?: {
    id: string;
    nome: string;
    email: string;
  };
  active: boolean;
  tipo_dependente: "mentoria" | "operacional";
}

export interface MentoradoWithPending {
  id: string;
  nome: string;
  pendingCount: number;
}

export interface UsePendingDependentesState {
  pendingDependentes: DependenteInfo[];
  isLoading: boolean;
  error: string | null;
  mentoradosWithPending: MentoradoWithPending[];
  selectedPermissions: Record<string, string>;
  processingId: string | null;
  confirmDeleteId: string | null;
}
