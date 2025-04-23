-- Migration de la base de données
BEGIN;

-- 1. Sauvegarder les données existantes
CREATE TABLE IF NOT EXISTS positions_backup AS SELECT * FROM positions;
CREATE TABLE IF NOT EXISTS candidate_positions_backup AS SELECT * FROM candidate_positions;

-- 2. Supprimer les tables existantes
DROP TABLE IF EXISTS candidate_positions;
DROP TABLE IF EXISTS positions;

-- 3. Recréer la table positions avec la bonne structure
CREATE TABLE positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme_id TEXT REFERENCES themes(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Recréer la table candidate_positions
CREATE TABLE candidate_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('agree', 'disagree', 'neutral')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Restaurer les données
INSERT INTO positions (id, theme_id, candidate_id, content, source_url, created_at)
SELECT 
    id,
    theme_id,
    (SELECT candidate_id FROM candidate_positions_backup WHERE position_id = positions_backup.id LIMIT 1),
    COALESCE(content, title, description),
    source_url,
    created_at
FROM positions_backup;

INSERT INTO candidate_positions (position_id, candidate_id, position, explanation, created_at)
SELECT 
    position_id,
    candidate_id,
    position,
    explanation,
    created_at
FROM candidate_positions_backup;

-- 6. Nettoyer les tables de sauvegarde
DROP TABLE IF EXISTS positions_backup;
DROP TABLE IF EXISTS candidate_positions_backup;

COMMIT; 