const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugThemes() {
  try {
    console.log('=== DEBUG THEMES START ===\n');

    // 1. Vérifier la table themes
    console.log('1. Contenu de la table themes:');
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*');
    
    if (themesError) {
      console.error('Erreur themes:', themesError);
    } else {
      console.table(themes);
    }

    // 2. Vérifier la table positions
    console.log('\n2. Dernières positions avec leurs theme_id:');
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('id, theme_id, content')
      .limit(5);
    
    if (positionsError) {
      console.error('Erreur positions:', positionsError);
    } else {
      console.table(positions);
    }

    // 3. Vérifier les jointures
    console.log('\n3. Test des jointures positions-themes:');
    const { data: joins, error: joinsError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        themes (
          id,
          name
        )
      `)
      .limit(5);
    
    if (joinsError) {
      console.error('Erreur jointures:', joinsError);
    } else {
      console.table(joins);
    }

    // 4. Compter les positions par thème
    console.log('\n4. Nombre de positions par thème:');
    const { data: counts, error: countsError } = await supabase
      .from('positions')
      .select('theme_id, count', { count: 'exact' })
      .group('theme_id');
    
    if (countsError) {
      console.error('Erreur comptage:', countsError);
    } else {
      console.table(counts);
    }

    // 5. Vérifier les thèmes sans positions
    console.log('\n5. Thèmes sans positions:');
    const { data: orphans, error: orphansError } = await supabase
      .from('themes')
      .select(`
        id,
        name,
        positions (count)
      `);
    
    if (orphansError) {
      console.error('Erreur orphelins:', orphansError);
    } else {
      const themesWithoutPositions = orphans.filter(t => !t.positions.length);
      console.table(themesWithoutPositions);
    }

    console.log('\n=== DEBUG THEMES END ===');
  } catch (error) {
    console.error('Erreur générale:', error);
  }
}

debugThemes(); 