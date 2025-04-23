-- Sauvegarde des données existantes
CREATE TABLE IF NOT EXISTS positions_backup AS SELECT * FROM positions;
CREATE TABLE IF NOT EXISTS themes_backup AS SELECT * FROM themes;
CREATE TABLE IF NOT EXISTS candidates_backup AS SELECT * FROM candidates;

-- Suppression des tables existantes
DROP TABLE IF EXISTS candidate_positions;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS themes;
DROP TABLE IF EXISTS candidates;

-- Création de la table themes
CREATE TABLE themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Création de la table candidates
CREATE TABLE candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    party TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Création de la table positions
CREATE TABLE positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme_id TEXT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source_url TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Création de la table candidate_positions
CREATE TABLE candidate_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('agree', 'disagree', 'neutral')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Restauration des données
INSERT INTO themes (id, name, description, created_at)
SELECT id, name, description, created_at
FROM themes_backup;

INSERT INTO candidates (id, name, party, created_at)
SELECT id, name, party, created_at
FROM candidates_backup;

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
    COALESCE(content, title, description) as content,
    source_url,
    title,
    description,
    created_at
FROM positions_backup;

-- Nettoyage des tables de sauvegarde
DROP TABLE IF EXISTS positions_backup;
DROP TABLE IF EXISTS themes_backup;
DROP TABLE IF EXISTS candidates_backup; 