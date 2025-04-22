import { supabase } from './config'

interface Theme {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface Position {
  id: string
  theme_id: string
  title: string
  description: string | null
  content: string | null
  source_url: string | null
  created_at: string
  candidate_positions?: {
    candidate: {
      id: string
      name: string
      party: string
    }[]
  }[]
}

export async function getThemeWithPositions(themeId: string): Promise<{ theme: Theme, positions: Position[] } | null> {
  try {
    // Get theme info
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single()

    if (themeError) {
      console.error('Error fetching theme:', themeError)
      return null
    }

    // Get positions with candidate info through the junction table
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        title,
        description,
        content,
        source_url,
        created_at,
        candidate_positions (
          candidate:candidates (
            id,
            name,
            party
          )
        )
      `)
      .eq('theme_id', themeId)

    if (positionsError) {
      console.error('Error fetching positions:', positionsError)
      return null
    }

    return {
      theme,
      positions: positions || []
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
} 