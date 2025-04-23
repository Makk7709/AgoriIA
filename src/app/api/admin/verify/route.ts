import { NextRequest, NextResponse } from 'next/server'

// Mot de passe en dur pour le test (à remplacer par une variable d'environnement en production)
const ADMIN_PASSWORD = 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Le mot de passe est requis' },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Mot de passe incorrect' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification du mot de passe' },
      { status: 500 }
    )
  }
} 