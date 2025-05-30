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
      application_users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          role: string
          status: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          date: string
          id: string
          image_aspect_ratio: string | null
          image_layout: string | null
          image_size: number | null
          image_url: string | null
          is_draft: boolean | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          date: string
          id?: string
          image_aspect_ratio?: string | null
          image_layout?: string | null
          image_size?: number | null
          image_url?: string | null
          is_draft?: boolean | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          id?: string
          image_aspect_ratio?: string | null
          image_layout?: string | null
          image_size?: number | null
          image_url?: string | null
          is_draft?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      course_materials: {
        Row: {
          course_id: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          course_id: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          course_id?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_registrations: {
        Row: {
          additional_notes: string | null
          company: string | null
          course_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          status: string
          status_history: Json[] | null
        }
        Insert: {
          additional_notes?: string | null
          company?: string | null
          course_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          status?: string
          status_history?: Json[] | null
        }
        Update: {
          additional_notes?: string | null
          company?: string | null
          course_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          status?: string
          status_history?: Json[] | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          category_id: string | null
          created_at: string | null
          created_by: string | null
          dates: string
          deleted_at: string | null
          description: string
          duration: string | null
          end_date: string | null
          event_type: string | null
          event_type_id: string | null
          format: string | null
          google_drive_folder_id: string | null
          google_drive_folder_url: string | null
          id: string
          image_aspect_ratio: string | null
          image_layout: string | null
          image_size: number | null
          image_url: string | null
          instructor: string
          is_template: boolean | null
          learning_outcomes: string[] | null
          location: string
          prerequisites: string | null
          price: string
          skill_level: string | null
          skill_level_id: string | null
          spots_available: number
          start_date: string | null
          status: string | null
          target_audience: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dates: string
          deleted_at?: string | null
          description: string
          duration?: string | null
          end_date?: string | null
          event_type?: string | null
          event_type_id?: string | null
          format?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          id?: string
          image_aspect_ratio?: string | null
          image_layout?: string | null
          image_size?: number | null
          image_url?: string | null
          instructor: string
          is_template?: boolean | null
          learning_outcomes?: string[] | null
          location: string
          prerequisites?: string | null
          price: string
          skill_level?: string | null
          skill_level_id?: string | null
          spots_available: number
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dates?: string
          deleted_at?: string | null
          description?: string
          duration?: string | null
          end_date?: string | null
          event_type?: string | null
          event_type_id?: string | null
          format?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          id?: string
          image_aspect_ratio?: string | null
          image_layout?: string | null
          image_size?: number | null
          image_url?: string | null
          instructor?: string
          is_template?: boolean | null
          learning_outcomes?: string[] | null
          location?: string
          prerequisites?: string | null
          price?: string
          skill_level?: string | null
          skill_level_id?: string | null
          spots_available?: number
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_skill_level_id_fkey"
            columns: ["skill_level_id"]
            isOneToOne: false
            referencedRelation: "skill_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string
          id: string
          label: string
          slug: string | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          slug?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          slug?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      skill_levels: {
        Row: {
          created_at: string
          id: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          content: string
          created_at: string | null
          creation_date: string | null
          first_name: string
          id: string
          image_url: string | null
          job_title: string | null
          last_name: string
          score: number | null
          source: string | null
          source_link: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string | null
          creation_date?: string | null
          first_name: string
          id?: string
          image_url?: string | null
          job_title?: string | null
          last_name: string
          score?: number | null
          source?: string | null
          source_link?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string | null
          creation_date?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          job_title?: string | null
          last_name?: string
          score?: number | null
          source?: string | null
          source_link?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_role: {
        Args: { user_id: string; required_role: string }
        Returns: boolean
      }
      has_role: {
        Args: { user_id: string; required_role: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_site_settings: {
        Args:
          | Record<PropertyKey, never>
          | { setting_key: string; setting_value: Json }
        Returns: undefined
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
    Enums: {},
  },
} as const
