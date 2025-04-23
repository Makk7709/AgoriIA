const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateDatabase() {
  console.log('🚀 Démarrage de la migration de la base de données...')

  try {
    // Vérification de la colonne created_at
    console.log('📝 Vérification de la colonne created_at...')
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE candidates 
        ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
      `
    })

    // Activation de RLS et création des politiques
    console.log('📝 Configuration des politiques RLS...')
    await supabase.rpc('exec_sql', {
      sql: `
        -- Activation de RLS
        ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

        -- Suppression des anciennes politiques si elles existent
        DROP POLICY IF EXISTS "Allow insert to anon" ON candidates;
        DROP POLICY IF EXISTS "Allow select to all" ON candidates;
        DROP POLICY IF EXISTS "Allow update to authenticated" ON candidates;
        DROP POLICY IF EXISTS "Allow delete to authenticated" ON candidates;

        -- Création des nouvelles politiques
        CREATE POLICY "Allow insert to anon" ON candidates 
          FOR INSERT 
          TO anon, authenticated 
          WITH CHECK (true);

        CREATE POLICY "Allow select to all" ON candidates 
          FOR SELECT 
          TO anon, authenticated 
          USING (true);

        CREATE POLICY "Allow update to authenticated" ON candidates 
          FOR UPDATE 
          TO authenticated 
          USING (true);

        CREATE POLICY "Allow delete to authenticated" ON candidates 
          FOR DELETE 
          TO authenticated 
          USING (true);
      `
    })

    console.log('✅ Migration terminée avec succès')
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

migrateDatabase() 