import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Positions pour Yannick Jadot
const jadotPositions = [
  {
    theme_id: 'ecologie',
    content: 'Mise en place d\'un plan massif de transition écologique avec un investissement de 50 milliards d\'euros par an.',
    title: 'Plan de transition écologique',
    description: 'Programme ambitieux pour la transition écologique et énergétique'
  },
  {
    theme_id: 'economie',
    content: 'Création d\'un ISF climatique et mise en place d\'une fiscalité écologique progressive.',
    title: 'Fiscalité écologique',
    description: 'Réforme fiscale pour une économie plus verte'
  },
  {
    theme_id: 'social',
    content: 'Augmentation du SMIC de 200€ net et revalorisation des minima sociaux.',
    title: 'Justice sociale',
    description: 'Mesures pour plus d\'équité sociale'
  },
  {
    theme_id: 'education',
    content: 'Recrutement de 65 000 enseignants et revalorisation des salaires dans l\'éducation.',
    title: 'Renforcement de l\'éducation',
    description: 'Plan pour l\'éducation nationale'
  },
  {
    theme_id: 'sante',
    content: 'Recrutement de 100 000 soignants et rénovation des hôpitaux publics.',
    title: 'Santé publique',
    description: 'Renforcement du système de santé'
  },
  {
    theme_id: 'securite',
    content: 'Création de 10 000 postes dans la police de proximité.',
    title: 'Sécurité de proximité',
    description: 'Réforme de la police et de la sécurité'
  },
  {
    theme_id: 'institutions',
    content: 'Mise en place d\'une dose de proportionnelle et référendum d\'initiative citoyenne.',
    title: 'Démocratie participative',
    description: 'Réformes institutionnelles'
  },
  {
    theme_id: 'europe',
    content: 'Renforcement de l\'Europe sociale et écologique.',
    title: 'Europe verte',
    description: 'Vision européenne écologique'
  }
]

// Positions pour Nathalie Arthaud
const arthaudPositions = [
  {
    theme_id: 'economie',
    content: 'Interdiction des licenciements et augmentation générale des salaires de 300 euros.',
    title: 'Lutte contre le chômage',
    description: 'Mesures économiques anticapitalistes'
  },
  {
    theme_id: 'social',
    content: 'Indexation des salaires sur l\'inflation et contrôle des prix.',
    title: 'Protection du pouvoir d\'achat',
    description: 'Mesures sociales pour les travailleurs'
  },
  {
    theme_id: 'education',
    content: 'Gratuité totale de l\'éducation et embauche massive d\'enseignants.',
    title: 'Éducation pour tous',
    description: 'Démocratisation de l\'enseignement'
  },
  {
    theme_id: 'sante',
    content: 'Nationalisation des groupes pharmaceutiques et gratuité des soins.',
    title: 'Santé publique',
    description: 'Système de santé universel'
  },
  {
    theme_id: 'ecologie',
    content: 'Planification écologique sous contrôle des travailleurs.',
    title: 'Écologie sociale',
    description: 'Vision écologique anticapitaliste'
  },
  {
    theme_id: 'securite',
    content: 'Réorganisation des forces de l\'ordre sous contrôle populaire.',
    title: 'Sécurité populaire',
    description: 'Réforme de la police'
  },
  {
    theme_id: 'institutions',
    content: 'Mise en place d\'une démocratie ouvrière et contrôle des entreprises par les travailleurs.',
    title: 'Démocratie ouvrière',
    description: 'Transformation des institutions'
  },
  {
    theme_id: 'europe',
    content: 'Pour une Europe des travailleurs, contre l\'Europe du capital.',
    title: 'Europe sociale',
    description: 'Vision internationale socialiste'
  }
]

async function insertMissingPositions() {
  console.log('🚀 Insertion des positions manquantes...')

  try {
    // 1. Récupérer les IDs des candidats
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('id, name')
      .in('name', ['Yannick Jadot', 'Nathalie Arthaud'])

    if (candidatesError) {
      console.error('❌ Erreur lors de la récupération des candidats:', candidatesError)
      return
    }

    const jadot = candidates.find(c => c.name === 'Yannick Jadot')
    const arthaud = candidates.find(c => c.name === 'Nathalie Arthaud')

    if (!jadot || !arthaud) {
      console.error('❌ Candidats non trouvés')
      return
    }

    // 2. Préparer les positions avec les IDs des candidats
    const jadotPositionsWithId = jadotPositions.map(pos => ({
      ...pos,
      candidate_id: jadot.id
    }))

    const arthaudPositionsWithId = arthaudPositions.map(pos => ({
      ...pos,
      candidate_id: arthaud.id
    }))

    // 3. Insérer les positions
    console.log('Insertion des positions de Yannick Jadot...')
    const { error: jadotError } = await supabase
      .from('positions')
      .upsert(jadotPositionsWithId)

    if (jadotError) {
      console.error('❌ Erreur lors de l\'insertion des positions de Jadot:', jadotError)
      return
    }

    console.log('Insertion des positions de Nathalie Arthaud...')
    const { error: arthaudError } = await supabase
      .from('positions')
      .upsert(arthaudPositionsWithId)

    if (arthaudError) {
      console.error('❌ Erreur lors de l\'insertion des positions d\'Arthaud:', arthaudError)
      return
    }

    console.log('✅ Positions insérées avec succès')
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

insertMissingPositions() 