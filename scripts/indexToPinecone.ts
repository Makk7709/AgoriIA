import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// Test de chargement des variables d'environnement
console.log("✅ Environnement chargé — SUPABASE_URL =", process.env.SUPABASE_URL);

// Initialisation Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialisation OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialisation Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// Fonction d'indexation
async function indexPositions() {
  const { data: positions, error } = await supabase
    .from('positions')
    .select('id, position, summary, theme_id, candidate')
    .limit(100); // adapter si besoin

  if (error) {
    console.error("❌ Erreur Supabase :", error.message);
    return;
  }

  for (const pos of positions) {
    const inputText = `${pos.candidate}: ${pos.summary || pos.position}`;

    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: inputText,
    });

    const vector = embedding.data[0].embedding;

    await index.upsert([
      {
        id: pos.id.toString(),
        values: vector,
        metadata: {
          candidate: pos.candidate,
          theme_id: pos.theme_id,
          summary: pos.summary,
          position: pos.position,
        },
      },
    ]);

    console.log(`✅ Indexé : ${pos.id} (${pos.candidate})`);
  }

  console.log("🚀 Indexation terminée !");
}

indexPositions(); 