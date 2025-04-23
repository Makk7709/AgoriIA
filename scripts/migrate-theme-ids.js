const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping des anciens IDs vers les nouveaux
const themeIdMapping = {
  'economy': 'economie',
  'ecology': 'ecologie',
  'security': 'securite',
  'health': 'sante',
  'education': 'education',
  'europe': 'europe',
  'institutions': 'institutions',
  'social': 'social'
};

async function migrateThemeIds() {
  try {
    console.log('Starting theme ID migration...');

    // 1. Vérifier les positions existantes
    const { data: positions, error: fetchError } = await supabase
      .from('positions')
      .select('id, theme_id');

    if (fetchError) {
      console.error('Error fetching positions:', fetchError);
      return;
    }

    console.log(`Found ${positions.length} positions to update`);

    // 2. Mettre à jour chaque position
    for (const position of positions) {
      const newThemeId = themeIdMapping[position.theme_id];
      
      if (!newThemeId) {
        console.warn(`No mapping found for theme_id: ${position.theme_id}`);
        continue;
      }

      const { error: updateError } = await supabase
        .from('positions')
        .update({ theme_id: newThemeId })
        .eq('id', position.id);

      if (updateError) {
        console.error(`Error updating position ${position.id}:`, updateError);
      } else {
        console.log(`Updated position ${position.id}: ${position.theme_id} → ${newThemeId}`);
      }
    }

    console.log('Theme ID migration completed!');
  } catch (error) {
    console.error('Unexpected error during migration:', error);
  }
}

migrateThemeIds(); 