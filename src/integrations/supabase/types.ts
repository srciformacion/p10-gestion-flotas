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
      applications: {
        Row: {
          applied_date: string
          id: string
          job_id: string
          last_updated: string
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          applied_date?: string
          id?: string
          job_id: string
          last_updated?: string
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          applied_date?: string
          id?: string
          job_id?: string
          last_updated?: string
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          name: string
          type: string
          uploaded_at: string
          url: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          uploaded_at?: string
          url: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          uploaded_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      location_alerts: {
        Row: {
          assignment_id: string
          details: string
          id: string
          latitude: number
          longitude: number
          request_id: string
          resolved: boolean
          resolved_at: string | null
          timestamp: string
          type: string
          vehicle_id: string
        }
        Insert: {
          assignment_id: string
          details: string
          id?: string
          latitude: number
          longitude: number
          request_id: string
          resolved?: boolean
          resolved_at?: string | null
          timestamp?: string
          type: string
          vehicle_id: string
        }
        Update: {
          assignment_id?: string
          details?: string
          id?: string
          latitude?: number
          longitude?: number
          request_id?: string
          resolved?: boolean
          resolved_at?: string | null
          timestamp?: string
          type?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          cv_url: string | null
          department: string | null
          dni: string
          first_name: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string
          role: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          cv_url?: string | null
          department?: string | null
          dni: string
          first_name?: string | null
          full_name: string
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone: string
          role?: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          cv_url?: string | null
          department?: string | null
          dni?: string
          first_name?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_history: {
        Row: {
          assignment_id: string
          completed: boolean
          distance: number | null
          duration: number | null
          end_time: string | null
          id: string
          start_time: string
          vehicle_id: string
        }
        Insert: {
          assignment_id: string
          completed?: boolean
          distance?: number | null
          duration?: number | null
          end_time?: string | null
          id?: string
          start_time?: string
          vehicle_id: string
        }
        Update: {
          assignment_id?: string
          completed?: boolean
          distance?: number | null
          duration?: number | null
          end_time?: string | null
          id?: string
          start_time?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      route_points: {
        Row: {
          heading: number | null
          id: string
          latitude: number
          longitude: number
          route_id: string
          speed: number | null
          timestamp: string
        }
        Insert: {
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          route_id: string
          speed?: number | null
          timestamp?: string
        }
        Update: {
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          route_id?: string
          speed?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_points_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_history"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_locations: {
        Row: {
          assigned_to_request_id: string | null
          estimated_arrival: string | null
          heading: number | null
          id: string
          in_service: boolean
          latitude: number
          license_plate: string
          longitude: number
          speed: number | null
          status: string
          timestamp: string
          vehicle_id: string
        }
        Insert: {
          assigned_to_request_id?: string | null
          estimated_arrival?: string | null
          heading?: number | null
          id?: string
          in_service?: boolean
          latitude: number
          license_plate: string
          longitude: number
          speed?: number | null
          status?: string
          timestamp?: string
          vehicle_id: string
        }
        Update: {
          assigned_to_request_id?: string | null
          estimated_arrival?: string | null
          heading?: number | null
          id?: string
          in_service?: boolean
          latitude?: number
          license_plate?: string
          longitude?: number
          speed?: number | null
          status?: string
          timestamp?: string
          vehicle_id?: string
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
      user_role: "candidate" | "hr"
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
      user_role: ["candidate", "hr"],
    },
  },
} as const
