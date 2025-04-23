import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fonction pour uploader un fichier dans le bucket pdfs
export async function uploadFile(file: File, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Erreur lors de l\'upload:', error)
      return { data: null, error }
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(path)

    return {
      data: {
        path,
        url: publicUrl
      },
      error: null
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return { data: null, error }
  }
}

// Fonction pour récupérer l'URL d'un fichier
export async function getFileUrl(path: string) {
  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(path)

  return {
    data: {
      publicUrl
    },
    error: null
  }
} 