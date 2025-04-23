const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  try {
    console.log('Checking database state...');

    // 1. Vérifier les thèmes
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*');

    if (themesError) {
      console.error('Error fetching themes:', themesError);
      return;
    }

    console.log('\nThemes in database:');
    console.log(themes);

    // 2. Vérifier les positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('*');

    if (positionsError) {
      console.error('Error fetching positions:', positionsError);
      return;
    }

    console.log('\nPositions in database:');
    console.log(positions);

    // 3. Vérifier les jointures
    const { data: joinedData, error: joinError } = await supabase
      .from('positions')
      .select(`
        *,
        theme:themes (*)
      `);

    if (joinError) {
      console.error('Error fetching joined data:', joinError);
      return;
    }

    console.log('\nJoined data (positions with themes):');
    console.log(joinedData);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkDatabase(); 