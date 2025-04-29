import { createClient } from '@supabase/supabase-js'
import type { Theme, Position } from '@/lib/types'
import { sanitizePositionContent, logContentDebug } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
        candidate:candidates (
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

    // Transform the data to match the Position interface and clean the content
    const transformedPositions = positions?.map(pos => {
      const cleanContent = sanitizePositionContent(pos.content);
      logContentDebug(cleanContent, `getThemeWithPositions-${pos.id}`);

      return {
        id: pos.id,
        theme_id: pos.theme_id,
        candidate_id: pos.candidate_id,
        content: cleanContent,
        source_url: pos.source_url,
        created_at: pos.created_at,
        candidate: Array.isArray(pos.candidate) ? pos.candidate[0] : pos.candidate
      };
    }) || []

    return {
      theme,
      positions: transformedPositions
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
} 