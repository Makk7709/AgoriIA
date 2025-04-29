/**
 * Configuration centralisée pour l'application
 * Ce fichier centralise toutes les variables d'environnement critiques
 * et fournit un accès typé et sécurisé à ces variables.
 */

// Types pour la configuration
type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceKey: string;
};

type PineconeConfig = {
  apiKey: string;
  environment: string;
  index: string;
};

type OpenAIConfig = {
  apiKey: string;
};

type Config = {
  supabase: SupabaseConfig;
  pinecone: PineconeConfig;
  openai: OpenAIConfig;
  isTest: boolean;
};

// Configuration exportée
export const config: Config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
    index: process.env.PINECONE_INDEX!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  isTest: process.env.NODE_ENV === 'test',
};

// Vérification de la présence des variables critiques
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'PINECONE_INDEX',
  'OPENAI_API_KEY',
] as const;

// Vérification au démarrage
if (process.env.NODE_ENV !== 'test') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
} 