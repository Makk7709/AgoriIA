'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Program {
  id: string
  title: string
  description: string | null
  pdf_url: string
  created_at: string
}

interface ProgramListProps {
  themeId: string
}

export function ProgramList({ themeId }: ProgramListProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadPrograms()
  }, [themeId])

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('theme_id', themeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrograms(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error)
      toast.error('Erreur lors du chargement des programmes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (programId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId)

      if (error) throw error

      toast.success('Programme supprimé avec succès')
      loadPrograms()
    } catch (error) {
      console.error('Erreur lors de la suppression du programme:', error)
      toast.error('Erreur lors de la suppression du programme')
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (programs.length === 0) {
    return <div className="text-gray-500">Aucun programme pour ce thème</div>
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <div
          key={program.id}
          className="border rounded-lg p-4 flex justify-between items-start"
        >
          <div>
            <h3 className="font-semibold">{program.title}</h3>
            {program.description && (
              <p className="text-sm text-gray-600 mt-1">{program.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Ajouté le {new Date(program.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={program.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir
              </a>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(program.id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
} 