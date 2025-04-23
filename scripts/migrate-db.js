const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateDatabase() {
  console.log('🚀 Démarrage de la migration de la base de données...')

  try {
    // SQL pour la migration
    const migrationSQL = `
      -- Créer ou remplacer la fonction exec_sql
      CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Extension nécessaire pour les UUID
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Table des thèmes
      CREATE TABLE IF NOT EXISTS public.themes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
      );

      -- Table des positions
      CREATE TABLE IF NOT EXISTS public.positions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        theme_id TEXT REFERENCES public.themes(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        source_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
      );

      -- Table des candidats
      CREATE TABLE IF NOT EXISTS public.candidates (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        party TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
      );

      -- Table des positions des candidats
      CREATE TABLE IF NOT EXISTS public.candidate_positions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
        candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
        position TEXT NOT NULL CHECK (position IN ('agree', 'disagree', 'neutral')),
        explanation TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
      );

      -- Table des programmes
      CREATE TABLE IF NOT EXISTS public.programs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        pdf_url TEXT,
        theme_id TEXT REFERENCES public.themes(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
      );
    `

    // Exécuter la migration
    console.log('📝 Exécution des commandes SQL de migration...')
    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    })

    if (migrationError) {
      console.error('❌ Erreur lors de la migration:', migrationError)
      return false
    }

    console.log('✅ Migration terminée avec succès!')
    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

migrateDatabase()
  .then(success => {
    if (success) {
      console.log('✨ Migration terminée avec succès!')
      process.exit(0)
    } else {
      console.error('❌ La migration a échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 