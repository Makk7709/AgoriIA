const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPositions() {
  try {
    console.log('Checking positions and themes...');

    // 1. Vérifier les positions récentes
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('id, theme_id, candidate_id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (positionsError) {
      console.error('Error fetching positions:', positionsError);
      return;
    }

    console.log('\nDernières positions insérées:');
    console.log(positions);

    // 2. Vérifier les thèmes associés
    const themeIds = [...new Set(positions.map(p => p.theme_id))];
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('id, name')
      .in('id', themeIds);

    if (themesError) {
      console.error('Error fetching themes:', themesError);
      return;
    }

    console.log('\nThèmes associés aux positions:');
    console.log(themes);

    // 3. Vérifier les jointures
    const { data: joinedData, error: joinError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        content,
        created_at,
        theme:themes (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (joinError) {
      console.error('Error fetching joined data:', joinError);
      return;
    }

    console.log('\nPositions avec leurs thèmes (jointure):');
    console.log(joinedData);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkPositions(); 