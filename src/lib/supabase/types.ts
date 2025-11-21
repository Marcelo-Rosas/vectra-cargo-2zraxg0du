// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          updated_at: string
          user_agent: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          updated_at?: string
          user_agent: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          updated_at?: string
          user_agent?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cashback_rules: {
        Row: {
          created_at: string
          id: string
          percentage: number
          uf: string
        }
        Insert: {
          created_at?: string
          id?: string
          percentage?: number
          uf: string
        }
        Update: {
          created_at?: string
          id?: string
          percentage?: number
          uf?: string
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      freight_quotations: {
        Row: {
          adjusted_revenue: number | null
          apply_markup: boolean
          apply_tax_on_costs: boolean
          calculated_revenue: number | null
          cargo_type: string
          cargo_weight: number | null
          created_at: string
          destination_uf: string
          distance_km: number
          equipment_rent: number | null
          final_freight: number | null
          freight_value: number | null
          gris: number | null
          gross_margin: number | null
          gross_margin_percent: number | null
          icms_percent: number | null
          icms_value: number | null
          id: string
          informed_freight: number | null
          invoice_value: number
          is_favorite: boolean
          loading_cost: number | null
          markup_value: number | null
          negotiated_freight: number | null
          notes: string | null
          numero_cotacao: string | null
          operational_costs: number | null
          origin_uf: string
          quotation_name: string | null
          suggested_freight: number | null
          tax_base: number | null
          toll: number | null
          total_costs: number | null
          tso: number | null
          unloading_cost: number | null
          updated_at: string
          use_table: boolean
          user_id: string
          vehicle_type: string | null
          vpo_oficial_comprovante_url: string | null
          vpo_oficial_data_consulta: string | null
          vpo_oficial_data_validade: string | null
          vpo_oficial_detalhe_pracas: Json | null
          vpo_oficial_id: string | null
          vpo_oficial_quantidade_pracas: number | null
          vpo_oficial_status: string | null
          vpo_oficial_valor: number | null
        }
        Insert: {
          adjusted_revenue?: number | null
          apply_markup?: boolean
          apply_tax_on_costs?: boolean
          calculated_revenue?: number | null
          cargo_type: string
          cargo_weight?: number | null
          created_at?: string
          destination_uf: string
          distance_km: number
          equipment_rent?: number | null
          final_freight?: number | null
          freight_value?: number | null
          gris?: number | null
          gross_margin?: number | null
          gross_margin_percent?: number | null
          icms_percent?: number | null
          icms_value?: number | null
          id?: string
          informed_freight?: number | null
          invoice_value: number
          is_favorite?: boolean
          loading_cost?: number | null
          markup_value?: number | null
          negotiated_freight?: number | null
          notes?: string | null
          numero_cotacao?: string | null
          operational_costs?: number | null
          origin_uf: string
          quotation_name?: string | null
          suggested_freight?: number | null
          tax_base?: number | null
          toll?: number | null
          total_costs?: number | null
          tso?: number | null
          unloading_cost?: number | null
          updated_at?: string
          use_table?: boolean
          user_id: string
          vehicle_type?: string | null
          vpo_oficial_comprovante_url?: string | null
          vpo_oficial_data_consulta?: string | null
          vpo_oficial_data_validade?: string | null
          vpo_oficial_detalhe_pracas?: Json | null
          vpo_oficial_id?: string | null
          vpo_oficial_quantidade_pracas?: number | null
          vpo_oficial_status?: string | null
          vpo_oficial_valor?: number | null
        }
        Update: {
          adjusted_revenue?: number | null
          apply_markup?: boolean
          apply_tax_on_costs?: boolean
          calculated_revenue?: number | null
          cargo_type?: string
          cargo_weight?: number | null
          created_at?: string
          destination_uf?: string
          distance_km?: number
          equipment_rent?: number | null
          final_freight?: number | null
          freight_value?: number | null
          gris?: number | null
          gross_margin?: number | null
          gross_margin_percent?: number | null
          icms_percent?: number | null
          icms_value?: number | null
          id?: string
          informed_freight?: number | null
          invoice_value?: number
          is_favorite?: boolean
          loading_cost?: number | null
          markup_value?: number | null
          negotiated_freight?: number | null
          notes?: string | null
          numero_cotacao?: string | null
          operational_costs?: number | null
          origin_uf?: string
          quotation_name?: string | null
          suggested_freight?: number | null
          tax_base?: number | null
          toll?: number | null
          total_costs?: number | null
          tso?: number | null
          unloading_cost?: number | null
          updated_at?: string
          use_table?: boolean
          user_id?: string
          vehicle_type?: string | null
          vpo_oficial_comprovante_url?: string | null
          vpo_oficial_data_consulta?: string | null
          vpo_oficial_data_validade?: string | null
          vpo_oficial_detalhe_pracas?: Json | null
          vpo_oficial_id?: string | null
          vpo_oficial_quantidade_pracas?: number | null
          vpo_oficial_status?: string | null
          vpo_oficial_valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_quotations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_simulations: {
        Row: {
          adjusted_revenue: number
          apply_markup: boolean
          apply_tax_on_costs: boolean
          calculated_revenue: number
          cargo_type: string
          cargo_weight: number
          created_at: string
          destination_uf: string
          distance_km: number
          equipment_rent: number
          final_freight: number
          freight_value: number
          gris: number
          gross_margin: number
          gross_margin_percent: number
          icms_interstate_id: string | null
          icms_percent: number
          icms_value: number
          id: string
          informed_freight: number
          invoice_value: number
          is_favorite: boolean
          loading_cost: number
          markup_value: number
          negotiated_freight: number
          notes: string | null
          ntc_fracionada_id: string | null
          ntc_lotacao_id: string | null
          operational_costs: number
          origin_uf: string
          simulation_name: string
          suggested_freight: number
          tax_base: number
          toll: number
          total_costs: number
          tso: number
          unloading_cost: number
          updated_at: string
          use_table: boolean
          user_id: string
          vehicle_type: string
        }
        Insert: {
          adjusted_revenue: number
          apply_markup?: boolean
          apply_tax_on_costs?: boolean
          calculated_revenue: number
          cargo_type: string
          cargo_weight: number
          created_at?: string
          destination_uf: string
          distance_km: number
          equipment_rent: number
          final_freight: number
          freight_value: number
          gris: number
          gross_margin: number
          gross_margin_percent: number
          icms_interstate_id?: string | null
          icms_percent: number
          icms_value: number
          id?: string
          informed_freight: number
          invoice_value: number
          is_favorite?: boolean
          loading_cost: number
          markup_value: number
          negotiated_freight: number
          notes?: string | null
          ntc_fracionada_id?: string | null
          ntc_lotacao_id?: string | null
          operational_costs: number
          origin_uf: string
          simulation_name: string
          suggested_freight: number
          tax_base: number
          toll: number
          total_costs: number
          tso: number
          unloading_cost: number
          updated_at?: string
          use_table?: boolean
          user_id: string
          vehicle_type: string
        }
        Update: {
          adjusted_revenue?: number
          apply_markup?: boolean
          apply_tax_on_costs?: boolean
          calculated_revenue?: number
          cargo_type?: string
          cargo_weight?: number
          created_at?: string
          destination_uf?: string
          distance_km?: number
          equipment_rent?: number
          final_freight?: number
          freight_value?: number
          gris?: number
          gross_margin?: number
          gross_margin_percent?: number
          icms_interstate_id?: string | null
          icms_percent?: number
          icms_value?: number
          id?: string
          informed_freight?: number
          invoice_value?: number
          is_favorite?: boolean
          loading_cost?: number
          markup_value?: number
          negotiated_freight?: number
          notes?: string | null
          ntc_fracionada_id?: string | null
          ntc_lotacao_id?: string | null
          operational_costs?: number
          origin_uf?: string
          simulation_name?: string
          suggested_freight?: number
          tax_base?: number
          toll?: number
          total_costs?: number
          tso?: number
          unloading_cost?: number
          updated_at?: string
          use_table?: boolean
          user_id?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "freight_simulations_icms_interstate_id_fkey"
            columns: ["icms_interstate_id"]
            isOneToOne: false
            referencedRelation: "icms_interstate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_simulations_ntc_fracionada_id_fkey"
            columns: ["ntc_fracionada_id"]
            isOneToOne: false
            referencedRelation: "ntc_fracionada"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_simulations_ntc_lotacao_id_fkey"
            columns: ["ntc_lotacao_id"]
            isOneToOne: false
            referencedRelation: "ntc_lotacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_simulations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generalities: {
        Row: {
          applies_to: string
          calculation_type: string
          code: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          value: number
          version_date: string
        }
        Insert: {
          applies_to: string
          calculation_type: string
          code: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          value: number
          version_date: string
        }
        Update: {
          applies_to?: string
          calculation_type?: string
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          value?: number
          version_date?: string
        }
        Relationships: []
      }
      icms_interstate: {
        Row: {
          created_at: string
          id: string
          percent: number
          uf_destination: string
          uf_origin: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          percent: number
          uf_destination: string
          uf_origin: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          percent?: number
          uf_destination?: string
          uf_origin?: string
          updated_at?: string
        }
        Relationships: []
      }
      integracoes_log: {
        Row: {
          cotacao_id: string | null
          created_at: string
          duracao_ms: number | null
          erro_mensagem: string | null
          http_status: number | null
          id: string
          request_payload: Json
          response_payload: Json | null
          status: string
          tipo: string
        }
        Insert: {
          cotacao_id?: string | null
          created_at?: string
          duracao_ms?: number | null
          erro_mensagem?: string | null
          http_status?: number | null
          id?: string
          request_payload: Json
          response_payload?: Json | null
          status: string
          tipo: string
        }
        Update: {
          cotacao_id?: string | null
          created_at?: string
          duracao_ms?: number | null
          erro_mensagem?: string | null
          http_status?: number | null
          id?: string
          request_payload?: Json
          response_payload?: Json | null
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_log_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "freight_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          endpoint: string
          id: string
          method: string
          request_payload: Json | null
          response_payload: Json | null
          status_code: number | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          endpoint: string
          id?: string
          method: string
          request_payload?: Json | null
          response_payload?: Json | null
          status_code?: number | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          endpoint?: string
          id?: string
          method?: string
          request_payload?: Json | null
          response_payload?: Json | null
          status_code?: number | null
        }
        Relationships: []
      }
      message_summaries: {
        Row: {
          conversation_id: string
          created_at: string
          created_by: string
          model: string
          summary: string
          token_count: number | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          created_by: string
          model: string
          summary: string
          token_count?: number | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          created_by?: string
          model?: string
          summary?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_summaries_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          author_id: string
          body: string
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
        }
        Insert: {
          author_id: string
          body: string
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ntc_fracionada: {
        Row: {
          created_at: string
          dispatch_fee: number
          distance_max: number
          distance_min: number
          freight_value_percent: number
          gris_percent: number
          id: string
          is_active: boolean
          multiplier: number
          price_per_kg: number
          price_per_shipment: number
          tso_min: number
          updated_at: string
          version_date: string
          weight_max: number
          weight_min: number
        }
        Insert: {
          created_at?: string
          dispatch_fee: number
          distance_max: number
          distance_min: number
          freight_value_percent: number
          gris_percent: number
          id?: string
          is_active?: boolean
          multiplier: number
          price_per_kg: number
          price_per_shipment: number
          tso_min: number
          updated_at?: string
          version_date: string
          weight_max: number
          weight_min: number
        }
        Update: {
          created_at?: string
          dispatch_fee?: number
          distance_max?: number
          distance_min?: number
          freight_value_percent?: number
          gris_percent?: number
          id?: string
          is_active?: boolean
          multiplier?: number
          price_per_kg?: number
          price_per_shipment?: number
          tso_min?: number
          updated_at?: string
          version_date?: string
          weight_max?: number
          weight_min?: number
        }
        Relationships: []
      }
      ntc_lotacao: {
        Row: {
          created_at: string
          distance_max: number
          distance_min: number
          freight_value_percent: number
          gris_percent: number
          id: string
          is_active: boolean
          price_per_km: number
          price_per_ton: number
          price_per_trip: number
          tso_percent: number
          updated_at: string
          version_date: string
        }
        Insert: {
          created_at?: string
          distance_max: number
          distance_min: number
          freight_value_percent: number
          gris_percent: number
          id?: string
          is_active?: boolean
          price_per_km: number
          price_per_ton: number
          price_per_trip: number
          tso_percent: number
          updated_at?: string
          version_date: string
        }
        Update: {
          created_at?: string
          distance_max?: number
          distance_min?: number
          freight_value_percent?: number
          gris_percent?: number
          id?: string
          is_active?: boolean
          price_per_km?: number
          price_per_ton?: number
          price_per_trip?: number
          tso_percent?: number
          updated_at?: string
          version_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      table_versions: {
        Row: {
          created_at: string
          file_name: string
          file_url: string
          id: string
          is_active: boolean
          notes: string | null
          records_count: number
          table_name: string
          updated_at: string
          uploaded_by: string
          version_date: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          is_active?: boolean
          notes?: string | null
          records_count?: number
          table_name: string
          updated_at?: string
          uploaded_by: string
          version_date: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          records_count?: number
          table_name?: string
          updated_at?: string
          uploaded_by?: string
          version_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_versions_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_tables_summary: {
        Row: {
          active_records: number | null
          latest_version: string | null
          table_name: string | null
        }
        Relationships: []
      }
      quotations_summary: {
        Row: {
          avg_margin_percent: number | null
          favorite_count: number | null
          last_quotation_date: string | null
          total_freight_value: number | null
          total_quotations: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_quotations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_icms_rate: {
        Args: { destination: string; origin: string }
        Returns: number
      }
      get_ntc_lotacao_rate: {
        Args: { distance: number; vehicle: string }
        Returns: {
          freight_value_percent: number
          gris_percent: number
          price_per_km: number
          price_per_ton: number
          price_per_trip: number
          tso_percent: number
        }[]
      }
      is_user_in_conversation: {
        Args: { p_conversation_id: string }
        Returns: boolean
      }
      log_audit: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

