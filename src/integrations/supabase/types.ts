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
      account_sanctions: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean
          issued_at: string
          issued_by_user_id: string | null
          reason: string | null
          sanction_type: Database["public"]["Enums"]["sanction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string
          issued_by_user_id?: string | null
          reason?: string | null
          sanction_type: Database["public"]["Enums"]["sanction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string
          issued_by_user_id?: string | null
          reason?: string | null
          sanction_type?: Database["public"]["Enums"]["sanction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          description: string
          difficulty: Database["public"]["Enums"]["achievement_difficulty"]
          icon_asset_name: string
          id: string
          name: string
          points: number
        }
        Insert: {
          description: string
          difficulty: Database["public"]["Enums"]["achievement_difficulty"]
          icon_asset_name: string
          id?: string
          name: string
          points: number
        }
        Update: {
          description?: string
          difficulty?: Database["public"]["Enums"]["achievement_difficulty"]
          icon_asset_name?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      friendships: {
        Row: {
          action_user_id: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
          user_one_id: string
          user_two_id: string
        }
        Insert: {
          action_user_id: string
          created_at?: string
          id?: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
          user_one_id: string
          user_two_id: string
        }
        Update: {
          action_user_id?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
          user_one_id?: string
          user_two_id?: string
        }
        Relationships: []
      }
      game_statistics: {
        Row: {
          avg_solve_time_s: number | null
          best_solve_time_s: number | null
          correct_math_problems: number
          draws: number
          id: string
          losses: number
          math_accuracy: number
          total_games: number
          total_math_problems: number
          updated_at: string
          user_id: string
          win_rate: number
          wins: number
        }
        Insert: {
          avg_solve_time_s?: number | null
          best_solve_time_s?: number | null
          correct_math_problems?: number
          draws?: number
          id?: string
          losses?: number
          math_accuracy?: number
          total_games?: number
          total_math_problems?: number
          updated_at?: string
          user_id: string
          win_rate?: number
          wins?: number
        }
        Update: {
          avg_solve_time_s?: number | null
          best_solve_time_s?: number | null
          correct_math_problems?: number
          draws?: number
          id?: string
          losses?: number
          math_accuracy?: number
          total_games?: number
          total_math_problems?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
          wins?: number
        }
        Relationships: []
      }
      player_rankings: {
        Row: {
          draws: number
          elo: number
          losses: number
          updated_at: string
          user_id: string
          wins: number
        }
        Insert: {
          draws?: number
          elo?: number
          losses?: number
          updated_at?: string
          user_id: string
          wins?: number
        }
        Update: {
          draws?: number
          elo?: number
          losses?: number
          updated_at?: string
          user_id?: string
          wins?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_difficulty: "Common" | "Rare" | "Epic" | "Legendary"
      friendship_status: "pending" | "accepted" | "blocked"
      sanction_type: "warning" | "temporary_ban" | "permanent_ban" | "mute"
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
      achievement_difficulty: ["Common", "Rare", "Epic", "Legendary"],
      friendship_status: ["pending", "accepted", "blocked"],
      sanction_type: ["warning", "temporary_ban", "permanent_ban", "mute"],
    },
  },
} as const
