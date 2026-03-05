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
      users: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          player1_id: string
          player2_id: string | null
          turn_player: string
          status: 'waiting' | 'active' | 'finished'
          created_at: string
          player1_score: number
          player2_score: number
          turn_count: number
        }
        Insert: {
          id?: string
          player1_id: string
          player2_id?: string | null
          turn_player: string
          status?: 'waiting' | 'active' | 'finished'
          created_at?: string
          player1_score?: number
          player2_score?: number
          turn_count?: number
        }
        Update: {
          id?: string
          player1_id?: string
          player2_id?: string | null
          turn_player?: string
          status?: 'waiting' | 'active' | 'finished'
          created_at?: string
          player1_score?: number
          player2_score?: number
          turn_count?: number
        }
      }
      moves: {
        Row: {
          id: string
          game_id: string
          player_id: string
          start_x: number
          start_y: number
          end_x: number
          end_y: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          player_id: string
          start_x: number
          start_y: number
          end_x: number
          end_y: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          player_id?: string
          start_x?: number
          start_y?: number
          end_x?: number
          end_y?: number
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
