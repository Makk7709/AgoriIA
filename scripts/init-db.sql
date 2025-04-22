-- Fonction pour initialiser la base de données
CREATE OR REPLACE FUNCTION init_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer les tables existantes si elles existent
  DROP TABLE IF EXISTS public.candidate_positions;
  DROP TABLE IF EXISTS public.positions;
  DROP TABLE IF EXISTS public.candidates;
  DROP TABLE IF EXISTS public.themes;

  -- Créer la table themes
  CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Créer la table candidates
  CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    party TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Créer la table positions
  CREATE TABLE IF NOT EXISTS public.positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme_id TEXT REFERENCES public.themes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Créer la table candidate_positions
  CREATE TABLE IF NOT EXISTS public.candidate_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('agree', 'disagree', 'neutral')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Insérer des données de test
  INSERT INTO public.themes (id, name, description) VALUES
    ('economy', 'Économie', 'Politiques économiques et fiscales'),
    ('ecology', 'Écologie', 'Environnement et transition écologique'),
    ('security', 'Sécurité', 'Sécurité intérieure et défense'),
    ('education', 'Éducation', 'Système éducatif et formation'),
    ('health', 'Santé', 'Système de santé et protection sociale'),
    ('europe', 'Europe', 'Relations européennes et internationales'),
    ('institutions', 'Institutions', 'Réforme des institutions et démocratie'),
    ('social', 'Social', 'Politiques sociales et solidarité');

  -- Insérer des candidats de test
  INSERT INTO public.candidates (name, party) VALUES
    ('Jean Dupont', 'Parti A'),
    ('Marie Martin', 'Parti B'),
    ('Pierre Durand', 'Parti C');

  -- Insérer des positions de test
  INSERT INTO public.positions (theme_id, title, description, content, source_url) VALUES
    ('economy', 'Réduction des impôts', 'Proposition de réduction des impôts sur les entreprises', 'Nous proposons une réduction progressive de l''impôt sur les sociétés de 33% à 25% sur 5 ans.', 'https://example.com/source1'),
    ('ecology', 'Transition écologique', 'Plan de transition écologique ambitieux', 'Notre objectif est d''atteindre la neutralité carbone d''ici 2050.', 'https://example.com/source2'),
    ('security', 'Renforcement de la sécurité', 'Augmentation des effectifs de police', 'Nous augmenterons les effectifs de police de 10 000 agents.', 'https://example.com/source3');

  -- Lier les candidats aux positions
  INSERT INTO public.candidate_positions (position_id, candidate_id, position, explanation) 
  SELECT 
    p.id,
    c.id,
    CASE 
      WHEN c.name = 'Jean Dupont' THEN 'agree'
      WHEN c.name = 'Marie Martin' THEN 'disagree'
      ELSE 'neutral'
    END,
    'Explication de la position'
  FROM public.positions p
  CROSS JOIN public.candidates c;
END;
$$; 