'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ProgramUploadProps {
  themeId: string
  onSuccess?: () => void
}

export function ProgramUpload({ themeId, onSuccess }: ProgramUploadProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }

    setLoading(true)
    try {
      // 1. Upload du PDF
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError, data } = await supabase.storage
        .from('programs')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('programs')
        .getPublicUrl(fileName)

      // 3. Créer l'entrée dans la base de données
      const { error: dbError } = await supabase
        .from('programs')
        .insert({
          title,
          description,
          pdf_url: publicUrl,
          theme_id: themeId
        })

      if (dbError) throw dbError

      toast.success('Programme ajouté avec succès!')
      setTitle('')
      setDescription('')
      setFile(null)
      onSuccess?.()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du programme:', error)
      toast.error('Erreur lors de l\'ajout du programme')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-sm text-gray-600">{file.name}</p>
        ) : (
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Déposez le fichier ici...'
              : 'Glissez-déposez un fichier PDF ici, ou cliquez pour sélectionner'}
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Ajout en cours...' : 'Ajouter le programme'}
      </Button>
    </form>
  )
} 