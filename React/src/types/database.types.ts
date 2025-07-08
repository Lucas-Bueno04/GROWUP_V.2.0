
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          nome: string
          cnpj: string
          nome_fantasia: string
          telefone: string
          solicitado_por: string
          data_solicitacao: string
          status: "ativo" | "aguardando" | "inativo"
          usuarios_autorizados: number
          setor: string
          porte: string
          site: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj: string
          nome_fantasia: string
          telefone: string
          solicitado_por: string
          data_solicitacao?: string
          status?: "ativo" | "aguardando" | "inativo"
          usuarios_autorizados?: number
          setor: string
          porte: string
          site?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string
          nome_fantasia?: string
          telefone?: string
          solicitado_por?: string
          data_solicitacao?: string
          status?: "ativo" | "aguardando" | "inativo"
          usuarios_autorizados?: number
          setor?: string
          porte?: string
          site?: string | null
          created_at?: string
        }
      }
      mentorados: {
        Row: {
          id: string
          nome: string
          email: string
          cpf: string
          telefone: string
          data_nascimento: string
          status: "ativo" | "inativo"
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          cpf: string
          telefone: string
          data_nascimento: string
          status?: "ativo" | "inativo"
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          cpf?: string
          telefone?: string
          data_nascimento?: string
          status?: "ativo" | "inativo"
          created_at?: string
        }
      }
      mentorado_empresas: {
        Row: {
          id: string
          mentorado_id: string
          empresa_id: string
          created_at: string
        }
        Insert: {
          id?: string
          mentorado_id: string
          empresa_id: string
          created_at?: string
        }
        Update: {
          id?: string
          mentorado_id?: string
          empresa_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
