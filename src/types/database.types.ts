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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      education: {
        Row: {
          course: string
          created_at: string
          id: number
          institution: string
          order_index: number
          period: string
          updated_at: string
        }
        Insert: {
          course: string
          created_at?: string
          id?: never
          institution: string
          order_index?: number
          period: string
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          id?: never
          institution?: string
          order_index?: number
          period?: string
          updated_at?: string
        }
        Relationships: []
      }
      etc: {
        Row: {
          created_at: string
          date: string
          id: number
          issuer: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: never
          issuer: string
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: never
          issuer?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: number
          order_index: number
          period: string
          position: string
          projects: Json
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: never
          order_index?: number
          period: string
          position: string
          projects?: Json
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: never
          order_index?: number
          period?: string
          position?: string
          projects?: Json
          updated_at?: string
        }
        Relationships: []
      }
      footer: {
        Row: {
          created_at: string
          github: string
          id: string
          originalRepo: string | null
          sign: string
          since: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          github: string
          id?: string
          originalRepo?: string | null
          sign: string
          since?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          github?: string
          id?: string
          originalRepo?: string | null
          sign?: string
          since?: number
          updated_at?: string
        }
        Relationships: []
      }
      introduce: {
        Row: {
          contents: string[]
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          contents?: string[]
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          contents?: string[]
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string
          email: string
          github: string
          id: string
          location: string
          name: string
          phone: string
          position: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          github: string
          id?: string
          location: string
          name: string
          phone: string
          position: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          github?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      project: {
        Row: {
          achievements: string[]
          created_at: string
          description: string | null
          id: number
          link: string | null
          order_index: number
          period: string
          skills: string[]
          title: string
          updated_at: string
          where: string | null
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          description?: string | null
          id?: never
          link?: string | null
          order_index?: number
          period: string
          skills?: string[]
          title: string
          updated_at?: string
          where?: string | null
        }
        Update: {
          achievements?: string[]
          created_at?: string
          description?: string | null
          id?: never
          link?: string | null
          order_index?: number
          period?: string
          skills?: string[]
          title?: string
          updated_at?: string
          where?: string | null
        }
        Relationships: []
      }
      skill: {
        Row: {
          category: string
          created_at: string
          id: number
          items: string[]
          order_index: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: never
          items?: string[]
          order_index?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: never
          items?: string[]
          order_index?: number
          updated_at?: string
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
