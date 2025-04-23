const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  console.log('🚀 Création de l\'utilisateur administrateur...')

  try {
    // 1. Créer l'utilisateur
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@korev-ai.com',
      password: 'Admin123!',
      email_confirm: true
    })

    if (userError) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', userError)
      return false
    }

    console.log('✅ Utilisateur créé:', user)

    // 2. Créer le profil administrateur
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.user.id,
        role: 'admin',
        email: user.user.email
      })

    if (profileError) {
      console.error('❌ Erreur lors de la création du profil:', profileError)
      return false
    }

    console.log('✅ Profil administrateur créé')
    console.log('✨ Utilisateur administrateur créé avec succès!')
    console.log('📧 Email: admin@korev-ai.com')
    console.log('🔑 Mot de passe: Admin123!')
    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

createAdminUser()
  .then(success => {
    if (success) {
      console.log('✨ Script terminé avec succès!')
      process.exit(0)
    } else {
      console.error('❌ Le script a échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 