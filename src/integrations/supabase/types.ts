export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      application_history: {
        Row: {
          application_id: string
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          application_id: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          application_id?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          academic_readiness_score: number | null
          admin_notes: string | null
          available_place_id: string
          created_at: string | null
          id: string
          learning_potential_score: number | null
          overall_score: number | null
          parent_engagement_score: number | null
          parent_notes: string | null
          priority_number: number | null
          school_id: string
          social_skills_score: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          submitted_date: string | null
          updated_at: string | null
        }
        Insert: {
          academic_readiness_score?: number | null
          admin_notes?: string | null
          available_place_id: string
          created_at?: string | null
          id?: string
          learning_potential_score?: number | null
          overall_score?: number | null
          parent_engagement_score?: number | null
          parent_notes?: string | null
          priority_number?: number | null
          school_id: string
          social_skills_score?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          submitted_date?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_readiness_score?: number | null
          admin_notes?: string | null
          available_place_id?: string
          created_at?: string | null
          id?: string
          learning_potential_score?: number | null
          overall_score?: number | null
          parent_engagement_score?: number | null
          parent_notes?: string | null
          priority_number?: number | null
          school_id?: string
          social_skills_score?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string
          submitted_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_available_place_id_fkey"
            columns: ["available_place_id"]
            isOneToOne: false
            referencedRelation: "available_places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      available_places: {
        Row: {
          academic_year: string
          application_deadline: string
          available_spots: number
          created_at: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          school_id: string
          total_spots: number
          updated_at: string | null
        }
        Insert: {
          academic_year?: string
          application_deadline: string
          available_spots?: number
          created_at?: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          school_id: string
          total_spots?: number
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          application_deadline?: string
          available_spots?: number
          created_at?: string | null
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          school_id?: string
          total_spots?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "available_places_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_required: boolean | null
          is_verified: boolean | null
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          is_verified?: boolean | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_required?: boolean | null
          is_verified?: boolean | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      school_admins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          school_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_admins_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          province: string | null
          school_type: Database["public"]["Enums"]["school_type"]
          town: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          province?: string | null
          school_type: Database["public"]["Enums"]["school_type"]
          town?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          province?: string | null
          school_type?: Database["public"]["Enums"]["school_type"]
          town?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string | null
          current_school: string | null
          date_of_birth: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          last_name: string
          medical_conditions: string | null
          parent_id: string
          special_needs: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_school?: string | null
          date_of_birth: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          last_name: string
          medical_conditions?: string | null
          parent_id: string
          special_needs?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_school?: string | null
          date_of_birth?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          last_name?: string
          medical_conditions?: string | null
          parent_id?: string
          special_needs?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_school_id: {
        Args: { user_id: string }
        Returns: string
      }
      is_school_admin: {
        Args: { user_id: string; school_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "parent" | "school_admin" | "super_admin"
      application_status:
        | "pending"
        | "under_review"
        | "enrolled"
        | "waitlisted"
        | "rejected"
      document_type:
        | "birth_certificate"
        | "immunization_records"
        | "transcripts"
        | "proof_of_residence"
        | "other"
      grade_level:
        | "Kindergarten"
        | "1st Grade"
        | "2nd Grade"
        | "3rd Grade"
        | "4th Grade"
        | "5th Grade"
        | "6th Grade"
        | "7th Grade"
        | "8th Grade"
        | "9th Grade"
        | "10th Grade"
        | "11th Grade"
        | "12th Grade"
      school_type: "Public" | "Private" | "Charter"
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
    Enums: {
      app_role: ["parent", "school_admin", "super_admin"],
      application_status: [
        "pending",
        "under_review",
        "enrolled",
        "waitlisted",
        "rejected",
      ],
      document_type: [
        "birth_certificate",
        "immunization_records",
        "transcripts",
        "proof_of_residence",
        "other",
      ],
      grade_level: [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ],
      school_type: ["Public", "Private", "Charter"],
    },
  },
} as const
