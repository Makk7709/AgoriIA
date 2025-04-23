import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exbzpsrzfknmcdrhjwrs.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ynpwc3J6ZmtubWNkcmhqd3JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTM0OTI3NCwiZXhwIjoyMDYwOTI1Mjc0fQ.glSkwzKnwcTrtCJPMTyjsscMzMJf1YRwrg3I_TuDJy4'

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

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