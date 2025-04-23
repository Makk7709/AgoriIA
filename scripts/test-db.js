const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://exbzpsrzfknmcdrhjwrs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ynpwc3J6ZmtubWNkcmhqd3JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTM0OTI3NCwiZXhwIjoyMDYwOTI1Mjc0fQ.glSkwzKnwcTrtCJPMTyjsscMzMJf1YRwrg3I_TuDJy4'
)

async function testDatabase() {
  console.log('🧪 Test de la base de données...')

  // Test 1: Vérifier les thèmes
  console.log('\n📋 Test 1: Vérification des thèmes')
  const { data: themes, error: themesError } = await supabase
    .from('themes')
    .select('*')
    .order('name')

  if (themesError) {
    console.error('❌ Erreur lors de la récupération des thèmes:', themesError)
    return false
  }

  console.log('✅ Thèmes récupérés:', themes.length)
  console.log('Thèmes:', themes)

  // Test 2: Vérifier les candidats
  console.log('\n📋 Test 2: Vérification des candidats')
  const { data: candidates, error: candidatesError } = await supabase
    .from('candidates')
    .select('*')
    .order('name')

  if (candidatesError) {
    console.error('❌ Erreur lors de la récupération des candidats:', candidatesError)
    return false
  }

  console.log('✅ Candidats récupérés:', candidates.length)
  console.log('Candidats:', candidates)

  return true
}

testDatabase()
  .then((success) => {
    if (success) {
      console.log('\n✅ Tests terminés avec succès')
    } else {
      console.error('\n❌ Tests échoués')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n❌ Erreur inattendue:', error)
    process.exit(1)
  }) 