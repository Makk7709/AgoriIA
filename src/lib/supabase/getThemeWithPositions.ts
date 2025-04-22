import { supabase } from './config'
import type { Theme, Position } from '@/lib/types'

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

    // Get positions with candidate info
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        candidate_id,
        content,
        source_url,
        created_at,
        candidate:candidates!inner (
          id,
          name,
          party
        )
      `)
      .eq('theme_id', themeId)

    if (positionsError) {
      console.error('Error fetching positions:', positionsError)
      return null
    }

    // Transform the data to match the Position interface
    const transformedPositions = positions?.map(pos => ({
      ...pos,
      candidate: Array.isArray(pos.candidate) ? pos.candidate[0] : pos.candidate
    })) || []

    return {
      theme,
      positions: transformedPositions
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
} 