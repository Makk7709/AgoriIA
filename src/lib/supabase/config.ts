import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          name: string
          party: string
          bio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          party: string
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          party?: string
          bio?: string | null
          created_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          theme_id: string
          candidate_id: string
          content: string
          source_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          theme_id: string
          candidate_id: string
          content: string
          source_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          theme_id?: string
          candidate_id?: string
          content?: string
          source_url?: string | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme_id: string
          alignment_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme_id: string
          alignment_score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme_id?: string
          alignment_score?: number
          created_at?: string
        }
      }
    }
  }
} 