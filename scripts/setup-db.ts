import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function setupDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    console.log('Lecture du fichier SQL...');
    const sqlFile = path.join(process.cwd(), 'supabase', 'migrations', '20240321_init.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    console.log('Exécution du script SQL...');
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sqlContent
    });

    if (error) {
      console.error('Erreur lors de l\'exécution du script:', error);
      process.exit(1);
    }

    console.log('Base de données configurée avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

setupDatabase(); 