const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initTestData() {
  console.log('🚀 Initialisation des données de test...')

  try {
    // 1. Créer les thèmes
    console.log('📚 Création des thèmes...')
    const themes = [
      {
        id: 'economy',
        name: 'Économie',
        description: 'Politiques économiques et fiscales'
      },
      {
        id: 'ecology',
        name: 'Écologie',
        description: 'Transition écologique et environnement'
      },
      {
        id: 'education',
        name: 'Éducation',
        description: 'Système éducatif et formation'
      }
    ]

    const { error: themesError } = await supabase
      .from('themes')
      .upsert(themes)

    if (themesError) {
      console.error('❌ Erreur lors de la création des thèmes:', themesError)
      return false
    }

    console.log('✅ Thèmes créés')

    // 2. Créer les candidats
    console.log('👥 Création des candidats...')
    const candidates = [
      {
        name: 'Jean Dupont',
        party: 'Parti A'
      },
      {
        name: 'Marie Martin',
        party: 'Parti B'
      }
    ]

    const { data: insertedCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .upsert(candidates)
      .select()

    if (candidatesError) {
      console.error('❌ Erreur lors de la création des candidats:', candidatesError)
      return false
    }

    console.log('✅ Candidats créés')

    // 3. Créer les positions
    console.log('📝 Création des positions...')
    const positions = []

    for (const theme of themes) {
      for (const candidate of insertedCandidates) {
        positions.push({
          theme_id: theme.id,
          candidate_id: candidate.id,
          content: `Position de ${candidate.name} sur ${theme.name}`,
          source_url: `https://example.com/${theme.id}/${candidate.id}`
        })
      }
    }

    const { data: insertedPositions, error: positionsError } = await supabase
      .from('positions')
      .upsert(positions)
      .select()

    if (positionsError) {
      console.error('❌ Erreur lors de la création des positions:', positionsError)
      return false
    }

    console.log('✅ Positions créées')

    // 4. Créer les candidate_positions
    console.log('🔗 Création des relations candidate_positions...')
    const candidatePositions = []

    for (const position of insertedPositions) {
      candidatePositions.push({
        position_id: position.id,
        candidate_id: position.candidate_id,
        position: Math.random() > 0.5 ? 'agree' : 'disagree',
        explanation: `Explication de la position sur ${position.content}`
      })
    }

    const { error: cpError } = await supabase
      .from('candidate_positions')
      .upsert(candidatePositions)

    if (cpError) {
      console.error('❌ Erreur lors de la création des candidate_positions:', cpError)
      return false
    }

    console.log('✅ Relations candidate_positions créées')

    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

// Exécuter l'initialisation
initTestData()
  .then(success => {
    if (success) {
      console.log('✨ Initialisation terminée avec succès!')
      process.exit(0)
    } else {
      console.error('❌ L\'initialisation a échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 