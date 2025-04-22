const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://exbzpsrzfknmcdrhjwrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ynpwc3J6ZmtubWNkcmhqd3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDkyNzQsImV4cCI6MjA2MDkyNTI3NH0.VX9TmgdJIZeeoFY0cE5XZeMjxTga1Rvx5bMd4dl-5DM'
)

async function initTestData() {
  console.log('🚀 Initialisation des données de test...')

  // 1. Supprimer les données existantes
  console.log('\n📋 Étape 1: Suppression des données existantes')
  const { error: deleteCpError } = await supabase
    .from('candidate_positions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteCpError) {
    console.error('❌ Erreur lors de la suppression des relations:', deleteCpError)
    return false
  }

  const { error: deletePositionsError } = await supabase
    .from('positions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deletePositionsError) {
    console.error('❌ Erreur lors de la suppression des positions:', deletePositionsError)
    return false
  }

  const { error: deleteCandidatesError } = await supabase
    .from('candidates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteCandidatesError) {
    console.error('❌ Erreur lors de la suppression des candidats:', deleteCandidatesError)
    return false
  }

  const { error: deleteThemesError } = await supabase
    .from('themes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteThemesError) {
    console.error('❌ Erreur lors de la suppression des thèmes:', deleteThemesError)
    return false
  }

  console.log('✅ Données existantes supprimées avec succès')

  // 2. Insérer les thèmes
  console.log('\n📋 Étape 2: Insertion des thèmes')
  const themes = [
    { id: 'economy', name: 'Économie', description: 'Politiques économiques et fiscales' },
    { id: 'ecology', name: 'Écologie', description: 'Environnement et transition écologique' },
    { id: 'security', name: 'Sécurité', description: 'Sécurité intérieure et défense' },
    { id: 'education', name: 'Éducation', description: 'Système éducatif et formation' },
    { id: 'health', name: 'Santé', description: 'Système de santé et protection sociale' },
    { id: 'europe', name: 'Europe', description: 'Relations européennes et internationales' },
    { id: 'institutions', name: 'Institutions', description: 'Réforme des institutions et démocratie' },
    { id: 'social', name: 'Social', description: 'Politiques sociales et solidarité' }
  ]

  const { error: themesError } = await supabase
    .from('themes')
    .insert(themes)

  if (themesError) {
    console.error('❌ Erreur lors de l\'insertion des thèmes:', themesError)
    return false
  }
  console.log('✅ Thèmes insérés avec succès')

  // 3. Insérer les candidats
  console.log('\n📋 Étape 3: Insertion des candidats')
  const candidates = [
    { name: 'Jean Dupont', party: 'Parti A' },
    { name: 'Marie Martin', party: 'Parti B' },
    { name: 'Pierre Durand', party: 'Parti C' }
  ]

  const { data: insertedCandidates, error: candidatesError } = await supabase
    .from('candidates')
    .insert(candidates)
    .select()

  if (candidatesError) {
    console.error('❌ Erreur lors de l\'insertion des candidats:', candidatesError)
    return false
  }
  console.log('✅ Candidats insérés avec succès')

  // 4. Insérer les positions
  console.log('\n📋 Étape 4: Insertion des positions')
  const positions = [
    {
      theme_id: 'economy',
      title: 'Réduction des impôts',
      description: 'Nous proposons une réduction progressive de l\'impôt sur les sociétés de 33% à 25% sur 5 ans.',
      source_url: 'https://example.com/source1'
    },
    {
      theme_id: 'ecology',
      title: 'Transition écologique',
      description: 'Notre objectif est d\'atteindre la neutralité carbone d\'ici 2050.',
      source_url: 'https://example.com/source2'
    },
    {
      theme_id: 'security',
      title: 'Renforcement de la sécurité',
      description: 'Nous augmenterons les effectifs de police de 10 000 agents.',
      source_url: 'https://example.com/source3'
    }
  ]

  const { data: insertedPositions, error: positionsError } = await supabase
    .from('positions')
    .insert(positions)
    .select()

  if (positionsError) {
    console.error('❌ Erreur lors de l\'insertion des positions:', positionsError)
    return false
  }
  console.log('✅ Positions insérées avec succès')

  // 5. Lier les candidats aux positions
  console.log('\n📋 Étape 5: Liaison des candidats aux positions')
  const candidatePositions = []
  insertedPositions.forEach(position => {
    insertedCandidates.forEach(candidate => {
      candidatePositions.push({
        position_id: position.id,
        candidate_id: candidate.id,
        position: candidate.name === 'Jean Dupont' ? 'agree' : candidate.name === 'Marie Martin' ? 'disagree' : 'neutral',
        explanation: `Explication de la position de ${candidate.name} sur ${position.title}`
      })
    })
  })

  const { error: cpError } = await supabase
    .from('candidate_positions')
    .insert(candidatePositions)

  if (cpError) {
    console.error('❌ Erreur lors de la liaison des candidats aux positions:', cpError)
    return false
  }
  console.log('✅ Candidats liés aux positions avec succès')

  console.log('\n✨ Initialisation des données de test terminée avec succès!')
  return true
}

// Exécuter l'initialisation
initTestData().then(success => {
  if (!success) {
    console.error('\n❌ L\'initialisation a échoué')
    process.exit(1)
  }
}) 