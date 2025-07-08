export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights_cache: {
        Row: {
          ano: number
          created_at: string
          empresa_id: string
          id: string
          insights_data: Json
          mes: number
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          empresa_id: string
          id?: string
          insights_data: Json
          mes: number
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          empresa_id?: string
          id?: string
          insights_data?: Json
          mes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_cache_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at: string
          description: string
          empresa_id: string | null
          id: string
          is_read: boolean
          is_resolved: boolean
          mentorado_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          title: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          description: string
          empresa_id?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          mentorado_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          title: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          description?: string
          empresa_id?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          mentorado_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string
          icon_url: string | null
          id: string
          name: string
          points: number
        }
        Insert: {
          created_at?: string
          description: string
          icon_url?: string | null
          id?: string
          name: string
          points?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      company_badge_awards: {
        Row: {
          awarded_at: string
          empresa_id: string
          faixa_id: string
          id: string
          is_notified: boolean
        }
        Insert: {
          awarded_at?: string
          empresa_id: string
          faixa_id: string
          id?: string
          is_notified?: boolean
        }
        Update: {
          awarded_at?: string
          empresa_id?: string
          faixa_id?: string
          id?: string
          is_notified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "company_badge_awards_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_badge_awards_faixa_id_fkey"
            columns: ["faixa_id"]
            isOneToOne: false
            referencedRelation: "faixas_faturamento"
            referencedColumns: ["id"]
          },
        ]
      }
      company_classification_history: {
        Row: {
          classification_date: string
          created_at: string
          current_revenue: number
          empresa_id: string
          growth_percentage: number | null
          id: string
          new_classification: string
          previous_classification: string | null
          previous_revenue: number | null
        }
        Insert: {
          classification_date?: string
          created_at?: string
          current_revenue: number
          empresa_id: string
          growth_percentage?: number | null
          id?: string
          new_classification: string
          previous_classification?: string | null
          previous_revenue?: number | null
        }
        Update: {
          classification_date?: string
          created_at?: string
          current_revenue?: number
          empresa_id?: string
          growth_percentage?: number | null
          id?: string
          new_classification?: string
          previous_classification?: string | null
          previous_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_classification_history_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      dependents: {
        Row: {
          active: boolean
          cargo: string | null
          created_at: string
          email: string
          id: string
          mentorado_id: string
          nome: string
          permission_level: string | null
          tipo_dependente: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          cargo?: string | null
          created_at?: string
          email: string
          id?: string
          mentorado_id: string
          nome: string
          permission_level?: string | null
          tipo_dependente?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          cargo?: string | null
          created_at?: string
          email?: string
          id?: string
          mentorado_id?: string
          nome?: string
          permission_level?: string | null
          tipo_dependente?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dependents_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_grupos: {
        Row: {
          created_at: string
          empresa_id: string
          grupo_tipo: string
          grupo_valor: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          grupo_tipo: string
          grupo_valor: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          grupo_tipo?: string
          grupo_valor?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_grupos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string
          created_at: string
          data_solicitacao: string | null
          faturamento_anual_anterior: number | null
          id: string
          nome: string
          nome_fantasia: string
          porte: string
          regiao: string | null
          regime_tributario: string | null
          setor: string
          site: string | null
          solicitado_por: string
          status: string | null
          telefone: string
          usuarios_autorizados: number | null
        }
        Insert: {
          cnpj: string
          created_at?: string
          data_solicitacao?: string | null
          faturamento_anual_anterior?: number | null
          id?: string
          nome: string
          nome_fantasia: string
          porte: string
          regiao?: string | null
          regime_tributario?: string | null
          setor: string
          site?: string | null
          solicitado_por: string
          status?: string | null
          telefone: string
          usuarios_autorizados?: number | null
        }
        Update: {
          cnpj?: string
          created_at?: string
          data_solicitacao?: string | null
          faturamento_anual_anterior?: number | null
          id?: string
          nome?: string
          nome_fantasia?: string
          porte?: string
          regiao?: string | null
          regime_tributario?: string | null
          setor?: string
          site?: string | null
          solicitado_por?: string
          status?: string | null
          telefone?: string
          usuarios_autorizados?: number | null
        }
        Relationships: []
      }
      faixas_faturamento: {
        Row: {
          ativa: boolean
          created_at: string
          id: string
          imagem_url: string | null
          nome: string
          ordem: number
          updated_at: string
          valor_maximo: number
          valor_minimo: number
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          imagem_url?: string | null
          nome: string
          ordem?: number
          updated_at?: string
          valor_maximo: number
          valor_minimo?: number
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          imagem_url?: string | null
          nome?: string
          ordem?: number
          updated_at?: string
          valor_maximo?: number
          valor_minimo?: number
        }
        Relationships: []
      }
      indicadores_empresa: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string
          descricao: string | null
          empresa_id: string
          formula: string
          id: string
          melhor_quando: string | null
          nome: string
          ordem: number
          tipo_visualizacao: string | null
          unidade: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string
          descricao?: string | null
          empresa_id: string
          formula: string
          id?: string
          melhor_quando?: string | null
          nome: string
          ordem?: number
          tipo_visualizacao?: string | null
          unidade?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          formula?: string
          id?: string
          melhor_quando?: string | null
          nome?: string
          ordem?: number
          tipo_visualizacao?: string | null
          unidade?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
      indicadores_medios: {
        Row: {
          ano: number
          created_at: string
          id: string
          indicador_codigo: string
          indicador_nome: string
          media_geral: number
          total_empresas: number
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          indicador_codigo: string
          indicador_nome: string
          media_geral?: number
          total_empresas?: number
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          indicador_codigo?: string
          indicador_nome?: string
          media_geral?: number
          total_empresas?: number
          updated_at?: string
        }
        Relationships: []
      }
      indicadores_medios_grupos: {
        Row: {
          created_at: string
          grupo_tipo: string
          grupo_valor: string
          id: string
          indicador_medio_id: string
          media_grupo: number
          total_empresas_grupo: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          grupo_tipo: string
          grupo_valor: string
          id?: string
          indicador_medio_id: string
          media_grupo?: number
          total_empresas_grupo?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          grupo_tipo?: string
          grupo_valor?: string
          id?: string
          indicador_medio_id?: string
          media_grupo?: number
          total_empresas_grupo?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicadores_medios_grupos_indicador_medio_id_fkey"
            columns: ["indicador_medio_id"]
            isOneToOne: false
            referencedRelation: "indicadores_medios"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_config: {
        Row: {
          allow_company_management: boolean
          allow_financial_access: boolean
          allow_goal_creation: boolean
          created_at: string
          id: string
          max_dependents: number
          mentor_id: string
          mentorado_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          allow_company_management?: boolean
          allow_financial_access?: boolean
          allow_goal_creation?: boolean
          created_at?: string
          id?: string
          max_dependents?: number
          mentor_id: string
          mentorado_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          allow_company_management?: boolean
          allow_financial_access?: boolean
          allow_goal_creation?: boolean
          created_at?: string
          id?: string
          max_dependents?: number
          mentor_id?: string
          mentorado_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_config_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_config_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_interactions: {
        Row: {
          content: string
          created_at: string
          id: string
          interaction_type: string
          is_visible_to_mentee: boolean
          mentor_id: string
          mentorado_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          interaction_type: string
          is_visible_to_mentee?: boolean
          mentor_id: string
          mentorado_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          interaction_type?: string
          is_visible_to_mentee?: boolean
          mentor_id?: string
          mentorado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_interactions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_interactions_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorado_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          is_notified: boolean
          mentorado_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          is_notified?: boolean
          mentorado_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          is_notified?: boolean
          mentorado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorado_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorado_badges_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorado_empresas: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          mentorado_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          mentorado_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          mentorado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorado_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorado_empresas_mentorado_id_fkey"
            columns: ["mentorado_id"]
            isOneToOne: false
            referencedRelation: "mentorados"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorados: {
        Row: {
          active_alerts: number | null
          cpf: string
          created_at: string
          data_nascimento: string
          email: string
          empresa: string | null
          goals_achieved: number | null
          goals_in_progress: number | null
          id: string
          last_activity: string | null
          nome: string
          score: number | null
          status: string
          telefone: string
        }
        Insert: {
          active_alerts?: number | null
          cpf: string
          created_at?: string
          data_nascimento: string
          email: string
          empresa?: string | null
          goals_achieved?: number | null
          goals_in_progress?: number | null
          id?: string
          last_activity?: string | null
          nome: string
          score?: number | null
          status?: string
          telefone: string
        }
        Update: {
          active_alerts?: number | null
          cpf?: string
          created_at?: string
          data_nascimento?: string
          email?: string
          empresa?: string | null
          goals_achieved?: number | null
          goals_in_progress?: number | null
          id?: string
          last_activity?: string | null
          nome?: string
          score?: number | null
          status?: string
          telefone?: string
        }
        Relationships: []
      }
      metas_indicadores: {
        Row: {
          ano: number
          conta_orcamento_id: string | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          indicador_id: string
          mes: number
          tipo_item_orcamento: string | null
          tipo_meta: string
          tipo_valor: string
          updated_at: string
          usuario_id: string
          valor_meta: number
          vinculado_orcamento: boolean | null
        }
        Insert: {
          ano: number
          conta_orcamento_id?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          indicador_id: string
          mes: number
          tipo_item_orcamento?: string | null
          tipo_meta?: string
          tipo_valor?: string
          updated_at?: string
          usuario_id: string
          valor_meta: number
          vinculado_orcamento?: boolean | null
        }
        Update: {
          ano?: number
          conta_orcamento_id?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          indicador_id?: string
          mes?: number
          tipo_item_orcamento?: string | null
          tipo_meta?: string
          tipo_valor?: string
          updated_at?: string
          usuario_id?: string
          valor_meta?: number
          vinculado_orcamento?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "metas_indicadores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metas_indicadores_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "orcamento_indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      metas_indicadores_empresa: {
        Row: {
          ano: number
          conta_orcamento_id: string | null
          created_at: string
          descricao: string | null
          empresa_id: string | null
          id: string
          indicador_empresa_id: string
          mes: number
          tipo_item_orcamento: string | null
          tipo_meta: string
          tipo_valor: string
          updated_at: string
          usuario_id: string
          valor_meta: number
          valor_realizado: number | null
          vinculado_orcamento: boolean | null
        }
        Insert: {
          ano: number
          conta_orcamento_id?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          indicador_empresa_id: string
          mes: number
          tipo_item_orcamento?: string | null
          tipo_meta?: string
          tipo_valor?: string
          updated_at?: string
          usuario_id: string
          valor_meta: number
          valor_realizado?: number | null
          vinculado_orcamento?: boolean | null
        }
        Update: {
          ano?: number
          conta_orcamento_id?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          indicador_empresa_id?: string
          mes?: number
          tipo_item_orcamento?: string | null
          tipo_meta?: string
          tipo_valor?: string
          updated_at?: string
          usuario_id?: string
          valor_meta?: number
          valor_realizado?: number | null
          vinculado_orcamento?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "metas_indicadores_empresa_indicador_empresa_id_fkey"
            columns: ["indicador_empresa_id"]
            isOneToOne: false
            referencedRelation: "indicadores_empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_contas: {
        Row: {
          codigo: string
          created_at: string
          editavel_aluno: boolean | null
          grupo_id: string
          id: string
          nome: string
          ordem: number
          sinal: Database["public"]["Enums"]["tipo_sinal"]
          updated_at: string
        }
        Insert: {
          codigo: string
          created_at?: string
          editavel_aluno?: boolean | null
          grupo_id: string
          id?: string
          nome: string
          ordem: number
          sinal?: Database["public"]["Enums"]["tipo_sinal"]
          updated_at?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          editavel_aluno?: boolean | null
          grupo_id?: string
          id?: string
          nome?: string
          ordem?: number
          sinal?: Database["public"]["Enums"]["tipo_sinal"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_contas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "orcamento_grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_empresa_grupos_valores: {
        Row: {
          created_at: string
          data_calculo: string
          grupo_id: string
          id: string
          mes: number
          orcamento_empresa_id: string
          updated_at: string
          valor_calculado: number
          valor_orcado: number
        }
        Insert: {
          created_at?: string
          data_calculo?: string
          grupo_id: string
          id?: string
          mes: number
          orcamento_empresa_id: string
          updated_at?: string
          valor_calculado?: number
          valor_orcado?: number
        }
        Update: {
          created_at?: string
          data_calculo?: string
          grupo_id?: string
          id?: string
          mes?: number
          orcamento_empresa_id?: string
          updated_at?: string
          valor_calculado?: number
          valor_orcado?: number
        }
        Relationships: []
      }
      orcamento_empresa_valores: {
        Row: {
          conta_id: string
          editado_em: string | null
          editado_por: string | null
          id: string
          mes: number
          observacoes: string | null
          orcamento_empresa_id: string
          updated_at: string
          valor_orcado: number | null
          valor_realizado: number | null
        }
        Insert: {
          conta_id: string
          editado_em?: string | null
          editado_por?: string | null
          id?: string
          mes: number
          observacoes?: string | null
          orcamento_empresa_id: string
          updated_at?: string
          valor_orcado?: number | null
          valor_realizado?: number | null
        }
        Update: {
          conta_id?: string
          editado_em?: string | null
          editado_por?: string | null
          id?: string
          mes?: number
          observacoes?: string | null
          orcamento_empresa_id?: string
          updated_at?: string
          valor_orcado?: number | null
          valor_realizado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_empresa_valores_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "orcamento_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamento_empresa_valores_orcamento_empresa_id_fkey"
            columns: ["orcamento_empresa_id"]
            isOneToOne: false
            referencedRelation: "orcamento_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_empresas: {
        Row: {
          ano: number
          created_at: string
          criado_por: string
          data_limite_edicao: string | null
          descricao: string | null
          empresa_id: string
          id: string
          mentor_responsavel: string
          nome: string
          permite_edicao_aluno: boolean | null
          status: string | null
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          criado_por: string
          data_limite_edicao?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          mentor_responsavel: string
          nome: string
          permite_edicao_aluno?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          criado_por?: string
          data_limite_edicao?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          mentor_responsavel?: string
          nome?: string
          permite_edicao_aluno?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orcamento_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamento_grupos: {
        Row: {
          codigo: string
          created_at: string
          editavel_aluno: boolean | null
          formula: string | null
          id: string
          nome: string
          ordem: number
          tipo_calculo: Database["public"]["Enums"]["tipo_calculo"]
          updated_at: string
        }
        Insert: {
          codigo: string
          created_at?: string
          editavel_aluno?: boolean | null
          formula?: string | null
          id?: string
          nome: string
          ordem: number
          tipo_calculo: Database["public"]["Enums"]["tipo_calculo"]
          updated_at?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          editavel_aluno?: boolean | null
          formula?: string | null
          id?: string
          nome?: string
          ordem?: number
          tipo_calculo?: Database["public"]["Enums"]["tipo_calculo"]
          updated_at?: string
        }
        Relationships: []
      }
      orcamento_indicadores: {
        Row: {
          codigo: string
          created_at: string
          descricao: string | null
          formula: string
          id: string
          incluir_calculo_medio: boolean
          melhor_quando: string | null
          nome: string
          ordem: number
          unidade: string | null
          updated_at: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao?: string | null
          formula: string
          id?: string
          incluir_calculo_medio?: boolean
          melhor_quando?: string | null
          nome: string
          ordem: number
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string | null
          formula?: string
          id?: string
          incluir_calculo_medio?: boolean
          melhor_quando?: string | null
          nome?: string
          ordem?: number
          unidade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          nome: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_indicador_empresa_consolidado: {
        Args: {
          p_empresa_id: string
          p_indicador_codigo: string
          p_formula: string
          p_ano: number
          p_mes_inicial?: number
          p_mes_final?: number
          p_tipo_calculo?: string
        }
        Returns: number
      }
      calcular_indicador_painel_empresa_mensal: {
        Args: {
          p_empresa_id: string
          p_indicador_codigo: string
          p_formula: string
          p_ano: number
          p_mes_ate?: number
        }
        Returns: number
      }
      calcular_receita_atual_empresa: {
        Args: { p_empresa_id: string; p_ano?: number }
        Returns: number
      }
      classificar_empresa_automatico: {
        Args: { p_empresa_id: string }
        Returns: undefined
      }
      classificar_empresa_por_receita: {
        Args: { p_empresa_id: string }
        Returns: undefined
      }
      delete_orcamento_empresa_complete: {
        Args: { p_orcamento_empresa_id: string }
        Returns: Json
      }
      get_all_profiles: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_mentorado_score: {
        Args: { p_mentorado_id: string }
        Returns: number
      }
      get_user_empresas: {
        Args: Record<PropertyKey, never>
        Returns: {
          empresa_id: string
          empresa_nome: string
        }[]
      }
      get_user_profile: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_role_optimized: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_safe: {
        Args: { user_id: string }
        Returns: string
      }
      inicializar_grupos_valores_existentes: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_aluno_or_dependente: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_mentor: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_mentor_optimized: {
        Args: { user_id: string }
        Returns: boolean
      }
      migrate_revenue_ranges_from_config: {
        Args: { ranges_json: Json }
        Returns: undefined
      }
      processar_formula_grupo: {
        Args: {
          formula_entrada: string
          orcamento_empresa_id: string
          mes_calculo: number
        }
        Returns: number
      }
      processar_formula_indicador: {
        Args: {
          formula_entrada: string
          orcamento_empresa_id: string
          mes_calculo: number
        }
        Returns: string
      }
      recalcular_grupos_valores: {
        Args: { p_orcamento_empresa_id: string; p_mes?: number }
        Returns: number
      }
      recalcular_medias_indicadores: {
        Args: { p_ano: number }
        Returns: undefined
      }
      user_can_access_mentorado: {
        Args: { user_id: string; mentorado_id: string }
        Returns: boolean
      }
      user_has_access_to_empresa: {
        Args: { user_id: string; empresa_id: string }
        Returns: boolean
      }
      user_has_empresa_access: {
        Args: { user_id: string; empresa_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_type:
        | "meta_estagnada"
        | "meta_piorou"
        | "meta_melhorou"
        | "aniversario"
        | "pagamento_pendente"
        | "inatividade"
        | "novo_conteudo"
      tipo_calculo: "soma" | "calculado" | "manual"
      tipo_sinal: "+" | "-"
      user_role: "aluno" | "dependente" | "mentor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: [
        "meta_estagnada",
        "meta_piorou",
        "meta_melhorou",
        "aniversario",
        "pagamento_pendente",
        "inatividade",
        "novo_conteudo",
      ],
      tipo_calculo: ["soma", "calculado", "manual"],
      tipo_sinal: ["+", "-"],
      user_role: ["aluno", "dependente", "mentor"],
    },
  },
} as const
