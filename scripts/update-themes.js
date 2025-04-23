import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const standardThemes = [
  {
    id: 'institutions',
    name: 'Institutions',
    description: 'Démocratie, institutions, décentralisation, réformes'
  },
  {
    id: 'economie',
    name: 'Économie',
    description: 'Politiques économiques, emploi, croissance, fiscalité'
  },
  {
    id: 'ecologie',
    name: 'Écologie',
    description: 'Transition écologique, énergie, biodiversité, climat'
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Protection sociale, solidarité, logement, culture'
  },
  {
    id: 'education',
    name: 'Éducation',
    description: 'École, formation, recherche, jeunesse'
  },
  {
    id: 'sante',
    name: 'Santé',
    description: 'Santé publique, hôpital, prévention, dépendance'
  },
  {
    id: 'securite',
    name: 'Sécurité',
    description: 'Sécurité intérieure, justice, police, défense'
  },
  {
    id: 'europe',
    name: 'Europe',
    description: 'Union européenne, relations internationales, diplomatie'
  }
]

async function updateThemes() {
  console.log('🚀 Mise à jour des thèmes...')

  try {
    // 1. Supprimer les thèmes en double
    console.log('1. Suppression des doublons...')
    const { error: deleteError } = await supabase
      .from('themes')
      .delete()
      .in('id', ['democratie', 'democratique'])

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression des doublons:', deleteError)
      return
    }

    // 2. Mettre à jour ou créer les thèmes standards
    console.log('2. Mise à jour des thèmes standards...')
    const { error: upsertError } = await supabase
      .from('themes')
      .upsert(standardThemes)

    if (upsertError) {
      console.error('❌ Erreur lors de la mise à jour des thèmes:', upsertError)
      return
    }

    // 3. Vérifier les positions existantes
    console.log('3. Vérification des positions...')
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        candidate_id,
        content,
        candidates (
          id,
          name
        )
      `)

    if (positionsError) {
      console.error('❌ Erreur lors de la récupération des positions:', positionsError)
      return
    }

    // Analyser les positions par candidat et par thème
    const positionsByCandidate = {}
    positions.forEach(position => {
      const candidateName = position.candidates?.name
      if (!positionsByCandidate[candidateName]) {
        positionsByCandidate[candidateName] = new Set()
      }
      positionsByCandidate[candidateName].add(position.theme_id)
    })

    console.log('\n📊 État des positions par candidat:')
    Object.entries(positionsByCandidate).forEach(([candidate, themes]) => {
      console.log(`\n${candidate}:`)
      console.log('Thèmes couverts:', Array.from(themes))
      console.log('Thèmes manquants:', standardThemes
        .map(t => t.id)
        .filter(id => !themes.has(id)))
    })

    console.log('\n✅ Mise à jour des thèmes terminée')
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

updateThemes() 