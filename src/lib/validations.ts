import { z } from 'zod'

// Schéma de validation pour l'analyse
export const analyzeSchema = z.object({
  text: z.string().min(1, 'Le texte est requis'),
  theme: z.string().min(1, 'Le thème est requis'),
  options: z.object({
    maxLength: z.number().optional(),
    language: z.string().optional(),
  }).optional(),
})

// Schéma de validation pour les thèmes
export const themeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
})

// Schéma de validation pour les questions
export const askSchema = z.object({
  question: z.string().min(1, 'La question est requise'),
  context: z.string().optional(),
  options: z.object({
    maxLength: z.number().optional(),
    language: z.string().optional(),
  }).optional(),
})

// Schéma de validation pour les candidats
export const candidateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  party: z.string().optional(),
})

// Schéma de validation pour les positions
export const positionSchema = z.object({
  themeId: z.string().min(1, 'Le thème est requis'),
  candidateId: z.string().min(1, 'Le candidat est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  sourceUrl: z.string().url().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

// Fonction utilitaire pour valider les entrées
export async function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Une erreur de validation est survenue' }
  }
} 