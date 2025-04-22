const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://exbzpsrzfknmcdrhjwrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ynpwc3J6ZmtubWNkcmhqd3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDkyNzQsImV4cCI6MjA2MDkyNTI3NH0.VX9TmgdJIZeeoFY0cE5XZeMjxTga1Rvx5bMd4dl-5DM'
)

async function testDatabase() {
  console.log('🧪 Démarrage des tests de la base de données...')

  // Test 1: Vérifier les thèmes
  console.log('\n📋 Test 1: Vérification des thèmes')
  const { data: themes, error: themesError } = await supabase
    .from('themes')
    .select('*')

  if (themesError) {
    console.error('❌ Erreur lors de la récupération des thèmes:', themesError)
    return false
  }

  console.log('✅ Thèmes récupérés avec succès:', themes.length)
  console.log('Thèmes:', themes.map(t => t.name).join(', '))

  // Test 2: Vérifier les candidats
  console.log('\n📋 Test 2: Vérification des candidats')
  const { data: candidates, error: candidatesError } = await supabase
    .from('candidates')
    .select('*')

  if (candidatesError) {
    console.error('❌ Erreur lors de la récupération des candidats:', candidatesError)
    return false
  }

  console.log('✅ Candidats récupérés avec succès:', candidates.length)
  console.log('Candidats:', candidates.map(c => `${c.name} (${c.party})`).join(', '))

  // Test 3: Vérifier les positions
  console.log('\n📋 Test 3: Vérification des positions')
  const { data: positions, error: positionsError } = await supabase
    .from('positions')
    .select(`
      *,
      candidate_positions (
        candidate:candidates (
          id,
          name,
          party
        )
      )
    `)

  if (positionsError) {
    console.error('❌ Erreur lors de la récupération des positions:', positionsError)
    return false
  }

  console.log('✅ Positions récupérées avec succès:', positions.length)
  positions.forEach(position => {
    console.log(`\nPosition: ${position.title}`)
    console.log(`Description: ${position.description || 'Non spécifiée'}`)
    console.log(`Contenu: ${position.content || 'Non spécifié'}`)
    console.log(`Source: ${position.source_url || 'Non spécifiée'}`)
    console.log('Candidats associés:')
    if (position.candidate_positions && position.candidate_positions.length > 0) {
      position.candidate_positions.forEach(cp => {
        if (cp.candidate && cp.candidate.length > 0) {
          const candidate = cp.candidate[0]
          console.log(`- ${candidate.name} (${candidate.party})`)
        }
      })
    } else {
      console.log('Aucun candidat associé')
    }
  })

  // Test 4: Vérifier les relations
  console.log('\n📋 Test 4: Vérification des relations')
  const { data: candidatePositions, error: cpError } = await supabase
    .from('candidate_positions')
    .select(`
      *,
      position:positions (*),
      candidate:candidates (*)
    `)

  if (cpError) {
    console.error('❌ Erreur lors de la récupération des relations:', cpError)
    return false
  }

  console.log('✅ Relations récupérées avec succès:', candidatePositions.length)
  candidatePositions.forEach(cp => {
    if (cp.candidate && cp.position) {
      console.log(`\nRelation: ${cp.candidate.name} - ${cp.position.title}`)
      console.log(`Position: ${cp.position}`)
      console.log(`Explication: ${cp.explanation || 'Non spécifiée'}`)
    }
  })

  console.log('\n✨ Tous les tests ont été passés avec succès!')
  return true
}

// Exécuter les tests
testDatabase().then(success => {
  if (!success) {
    console.error('\n❌ Certains tests ont échoué')
    process.exit(1)
  }
}) 