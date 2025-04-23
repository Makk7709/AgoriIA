import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractPositionsFromText, validateAndEnrichPositions } from '@/lib/openai/parse';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to normalize theme IDs (lowercase, remove accents)
function normalizeThemeId(theme: string): string {
  const themeMap: { [key: string]: string } = {
    'Écologie': 'ecologie',
    'Économie': 'economie',
    'Sécurité': 'securite',
    'Santé': 'sante',
    'Éducation': 'education',
    'Europe': 'europe',
    'Institutions': 'institutions',
    'Social': 'social'
  };

  // Si le thème est dans la map, utiliser l'ID correspondant
  if (themeMap[theme]) {
    return themeMap[theme];
  }

  // Sinon, normaliser le thème
  return theme
    .toLowerCase()
    // Remove accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^a-z0-9-]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { text, candidate } = await request.json();

    if (!text || !candidate) {
      console.error('Missing required fields:', { text: !!text, candidate: !!candidate });
      return NextResponse.json(
        { error: 'Text and candidate are required' },
        { status: 400 }
      );
    }

    console.log('Analyzing text for candidate:', candidate);
    console.log('Text length:', text.length);
    console.log('First 100 characters:', text.slice(0, 100));

    // Extraction des positions
    console.log('Starting position extraction...');
    const positions = await extractPositionsFromText(text, candidate);
    console.log('Extracted positions:', positions);
    
    // Validation et enrichissement
    console.log('Starting position validation...');
    const validatedPositions = await validateAndEnrichPositions(positions);
    console.log('Validated positions:', validatedPositions);

    // 3. Créer ou récupérer le candidat
    const { data: existingCandidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id')
      .eq('name', candidate)
      .single();

    if (candidateError && candidateError.code !== 'PGRST116') {
      console.error('Error checking candidate:', candidateError);
      return NextResponse.json(
        { error: 'Error checking candidate' },
        { status: 500 }
      );
    }

    let candidateId;
    if (!existingCandidate) {
      const { data: newCandidate, error: createError } = await supabase
        .from('candidates')
        .insert({ name: candidate })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating candidate:', createError);
        return NextResponse.json(
          { error: 'Error creating candidate' },
          { status: 500 }
        );
      }
      candidateId = newCandidate.id;
    } else {
      candidateId = existingCandidate.id;
    }

    // 4. Enregistrer les positions
    const positionsToInsert = validatedPositions.map(pos => ({
      theme_id: normalizeThemeId(pos.theme),
      candidate_id: candidateId,
      content: pos.summary,
      source_url: pos.source,
      created_at: new Date().toISOString()
    }));

    console.log('Positions to insert:', positionsToInsert);

    // Vérifier que tous les thèmes existent
    const themeIds = [...new Set(positionsToInsert.map(p => p.theme_id))];
    const { data: existingThemes, error: themesError } = await supabase
      .from('themes')
      .select('id')
      .in('id', themeIds);

    if (themesError) {
      console.error('Error checking themes:', themesError);
      return NextResponse.json(
        { error: 'Error checking themes' },
        { status: 500 }
      );
    }

    const existingThemeIds = existingThemes.map(t => t.id);
    const missingThemes = themeIds.filter(id => !existingThemeIds.includes(id));

    if (missingThemes.length > 0) {
      // Tenter de créer les thèmes manquants
      const themesToCreate = missingThemes.map(id => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
        description: `Thème ${id}`
      }));

      const { error: createThemesError } = await supabase
        .from('themes')
        .insert(themesToCreate);

      if (createThemesError) {
        console.error('Error creating missing themes:', createThemesError);
        return NextResponse.json(
          { error: `Missing themes: ${missingThemes.join(', ')}` },
          { status: 400 }
        );
      }

      console.log('Created missing themes:', themesToCreate);
    }

    // Insérer les positions
    const { data: insertedPositions, error: positionsError } = await supabase
      .from('positions')
      .insert(positionsToInsert)
      .select();

    if (positionsError) {
      console.error('Error inserting positions:', positionsError);
      return NextResponse.json(
        { error: 'Error inserting positions' },
        { status: 500 }
      );
    }

    console.log('Successfully inserted positions:', insertedPositions);

    return NextResponse.json({ positions: validatedPositions });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 