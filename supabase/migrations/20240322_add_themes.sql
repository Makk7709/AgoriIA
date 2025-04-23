-- Create themes table
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Create policies for themes table
CREATE POLICY "Enable read access for all users" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.themes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.themes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.themes FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some initial themes
INSERT INTO public.themes (id, name, description) VALUES
('education', 'Éducation et Culture', 'Propositions concernant l''éducation, la culture et la formation'),
('sante', 'Santé', 'Propositions concernant la santé, l''accès aux soins et le système de santé'),
('europe', 'Europe', 'Propositions concernant l''Union Européenne et la politique européenne'),
('institutions', 'Institutions', 'Propositions concernant la réforme des institutions et la démocratie')
ON CONFLICT (id) DO NOTHING; 