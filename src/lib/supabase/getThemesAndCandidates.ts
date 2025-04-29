import { createClient } from '@supabase/supabase-js'
import type { Theme, Candidate } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function getThemesAndCandidates(): Promise<{ themes: Theme[], candidates: Candidate[] }> {
  try {
    // Get themes
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*')
      .order('name')

    if (themesError) {
      console.error('Error fetching themes:', themesError)
      return { themes: [], candidates: [] }
    }

    // Get candidates
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .order('name')

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError)
      return { themes: themes || [], candidates: [] }
    }

    return {
      themes: themes || [],
      candidates: candidates || []
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { themes: [], candidates: [] }
  }
} 