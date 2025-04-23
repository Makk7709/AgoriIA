const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const themes = [
  {
    id: "economie",
    name: "Économie",
    description: "Politiques économiques, emploi, croissance, fiscalité",
  },
  {
    id: "ecologie",
    name: "Écologie",
    description: "Transition écologique, énergie, biodiversité, climat",
  },
  {
    id: "securite",
    name: "Sécurité",
    description: "Sécurité intérieure, justice, police, défense",
  },
  {
    id: "education",
    name: "Éducation",
    description: "École, formation, recherche, jeunesse",
  },
  {
    id: "sante",
    name: "Santé",
    description: "Santé publique, hôpital, prévention, dépendance",
  },
  {
    id: "europe",
    name: "Europe",
    description: "Union européenne, relations internationales, diplomatie",
  },
  {
    id: "institutions",
    name: "Institutions",
    description: "Démocratie, institutions, décentralisation, réformes",
  },
  {
    id: "social",
    name: "Social",
    description: "Protection sociale, solidarité, logement, culture",
  },
];

async function initDatabase() {
  try {
    // Supprimer les données existantes
    const { error: deleteCandidatePositionsError } = await supabase
      .from('candidate_positions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteCandidatePositionsError) {
      console.error('Erreur lors de la suppression des positions des candidats:', deleteCandidatePositionsError);
      return;
    }

    const { error: deletePositionsError } = await supabase
      .from('positions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deletePositionsError) {
      console.error('Erreur lors de la suppression des positions:', deletePositionsError);
      return;
    }

    // Supprimer TOUS les candidats (y compris les tests)
    const { error: deleteCandidatesError } = await supabase
      .from('candidates')
      .delete()
      .not('id', 'is', null); // Supprime tous les candidats

    if (deleteCandidatesError) {
      console.error('Erreur lors de la suppression des candidats:', deleteCandidatesError);
      return;
    }

    console.log('Anciens candidats supprimés avec succès !');

    // Créer uniquement les candidats valides
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .upsert([
        { 
          name: "Nathalie Arthaud",
          party: "Lutte Ouvrière"
        },
        { 
          name: "Yannick Jadot",
          party: "Europe Écologie Les Verts"
        }
      ])
      .select();

    if (candidatesError) {
      console.error('Erreur lors de la création des candidats:', candidatesError);
      return;
    }

    console.log('Nouveaux candidats créés avec succès !');

    // Insérer les thèmes
    const { error: themesError } = await supabase
      .from('themes')
      .insert(themes);

    if (themesError) {
      console.error('Erreur lors de la création des thèmes:', themesError);
      return;
    }

    console.log('Thèmes créés avec succès !');

    // Créer les positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .insert([
        {
          theme_id: "economie",
          title: "Réduction du temps de travail",
          description: "Proposition de réduire la semaine de travail à 32 heures."
        },
        {
          theme_id: "economie",
          title: "Revenu universel",
          description: "Mise en place d'un revenu universel pour tous les citoyens."
        }
      ])
      .select();

    if (positionsError) {
      console.error('Erreur lors de la création des positions:', positionsError);
      return;
    }

    console.log('Positions créées avec succès !');

    // Créer les positions des candidats
    const candidatePositions = [];
    positions.forEach(position => {
      candidates.forEach(candidate => {
        candidatePositions.push({
          position_id: position.id,
          candidate_id: candidate.id,
          position: candidate.name === "Candidat A" ? "agree" : "disagree"
        });
      });
    });

    const { error: candidatePositionsError } = await supabase
      .from('candidate_positions')
      .insert(candidatePositions);

    if (candidatePositionsError) {
      console.error('Erreur lors de la création des positions des candidats:', candidatePositionsError);
      return;
    }

    console.log('Positions des candidats créées avec succès !');
    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

initDatabase(); 