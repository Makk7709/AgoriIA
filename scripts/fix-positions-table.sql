-- 1. Sauvegarder les données existantes
CREATE TABLE IF NOT EXISTS positions_backup AS SELECT * FROM positions;

-- 2. Supprimer la table existante
DROP TABLE IF EXISTS positions;

-- 3. Recréer la table avec la structure correcte
CREATE TABLE positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme_id TEXT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source_url TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- 4. Restaurer les données
INSERT INTO positions (
    id,
    theme_id,
    candidate_id,
    content,
    source_url,
    title,
    description,
    created_at
)
SELECT 
    id,
    theme_id,
    candidate_id,
    COALESCE(content, title, description),
    source_url,
    title,
    description,
    created_at
FROM positions_backup;

-- 5. Nettoyer
DROP TABLE IF EXISTS positions_backup; 