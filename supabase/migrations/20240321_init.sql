-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    party TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create themes table
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create positions table
CREATE TABLE IF NOT EXISTS public.positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme_id TEXT NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source_url TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create candidate_positions table
CREATE TABLE IF NOT EXISTS public.candidate_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('agree', 'disagree', 'neutral')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(position_id, candidate_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_positions_candidate_id ON public.positions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_positions_theme_id ON public.positions(theme_id);
CREATE INDEX IF NOT EXISTS idx_candidate_positions_position_id ON public.candidate_positions(position_id);
CREATE INDEX IF NOT EXISTS idx_candidate_positions_candidate_id ON public.candidate_positions(candidate_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.themes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.themes;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable update for all users" ON public.themes;
DROP POLICY IF EXISTS "Enable update for all users" ON public.positions;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.themes;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.positions;

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_positions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.positions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.candidate_positions FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.themes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.positions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.candidate_positions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.candidates FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON public.themes FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON public.positions FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON public.candidate_positions FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.candidates FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.themes FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.positions FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.candidate_positions FOR DELETE USING (true);

-- Create storage bucket if not exists
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('pdfs', 'pdfs', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policies
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload access" ON storage.objects;

-- Temporary MVP policy: Allow all access
CREATE POLICY "Allow all access for MVP"
ON storage.objects FOR ALL
USING (true)
WITH CHECK (true); 