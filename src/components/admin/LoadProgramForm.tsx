'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, FileUp, X, FileIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import type { Position } from '@/lib/openai/parse';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { uploadFile } from '@/lib/supabase/storage';

interface Theme {
  name: string;
  description: string;
}

interface ProgramData {
  id: string;
  title: string;
  pdf_url: string;
  created_at: string;
  candidate_id: string;
  candidates: {
    name: string;
  }[];
}

// Déplacer l'initialisation du client en dehors du composant
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function LoadProgramForm() {
  const [candidate, setCandidate] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [programs, setPrograms] = useState<Array<{
    id: string;
    title: string;
    candidate: string;
    created_at: string;
    pdf_url: string;
  }>>([]);

  // Initialiser le client Supabase avec vérification
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variables Supabase manquantes:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        url: supabaseUrl || 'non définie',
        keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
      });
      return null;
    }
    console.log('Initialisation du client Supabase avec URL:', supabaseUrl);
    try {
      const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
      console.log('Client Supabase créé avec succès');
      return client;
    } catch (error) {
      console.error('Erreur lors de la création du client Supabase:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch('/api/themes');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch themes');
        }

        setThemes(data.themes);
      } catch (err) {
        console.error('Error fetching themes:', err);
        toast.error('Erreur lors du chargement des thèmes');
      }
    }

    fetchThemes();
  }, []);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        if (!supabase) {
          const error = new Error('Client Supabase non initialisé - Vérifiez vos variables d\'environnement');
          console.error(error.message, {
            supabaseUrl: supabaseUrl || 'non définie',
            supabaseKeyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
          });
          throw error;
        }

        const client = supabase;

        console.log('Test de connexion Supabase...');
        
        try {
          console.log('Tentative de requête test...');
          const { data: testData, error: testError } = await client
            .from('programs')
            .select('count')
            .limit(1)
            .throwOnError();

          if (testError) {
            console.error('Erreur détaillée du test de connexion:', {
              message: (testError as PostgrestError).message,
              details: (testError as PostgrestError).details,
              hint: (testError as PostgrestError).hint,
              code: (testError as PostgrestError).code
            });
            throw testError;
          }

          console.log('Test de connexion réussi:', testData);
        } catch (testErr) {
          const error = testErr as Error;
          console.error('Erreur lors du test de connexion:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause
          });
          throw new Error(`Erreur de connexion Supabase: ${error.message}`);
        }

        // Requête principale
        const { data, error } = await client
          .from('programs')
          .select(`
            id,
            title,
            pdf_url,
            created_at,
            candidate_id,
            candidate:candidate_id (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur détaillée de la requête principale:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        if (!data) {
          console.log('No data returned from Supabase');
          setPrograms([]);
          return;
        }

        console.log('Fetched programs:', data);

        const formattedPrograms = (data as unknown as Array<{
          id: string;
          title: string;
          pdf_url: string;
          created_at: string;
          candidate: { name: string };
        }>).map(program => ({
          id: program.id,
          title: program.title,
          candidate: program.candidate?.name || 'Candidat inconnu',
          created_at: program.created_at,
          pdf_url: program.pdf_url
        }));

        setPrograms(formattedPrograms);
      } catch (err) {
        console.error('Error fetching programs:', err);
        if (err instanceof Error) {
          toast.error(`Erreur: ${err.message}`);
        } else {
          toast.error('Erreur lors du chargement des programmes');
        }
      }
    }

    fetchPrograms();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        setError('Veuillez sélectionner un fichier PDF valide');
        return;
      }

      setFileName(file.name);
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process PDF');
        }

        setText(data.text);
        
        // Créer une prévisualisation du PDF
        const objectUrl = URL.createObjectURL(file);
        setFilePreview(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de l\'extraction du PDF');
      } finally {
        setIsLoading(false);
      }
    },
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const clearFile = () => {
    setFileName(null);
    setText('');
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, candidate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze positions');
      }

      // Vérifier que data.positions est un tableau
      if (!Array.isArray(data.positions)) {
        console.error('Format de positions invalide:', data.positions);
        throw new Error('Le format des positions reçues est invalide');
      }

      setPositions(data.positions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur complète:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!positions || !Array.isArray(positions) || positions.length === 0) {
      toast.error('Aucune position à enregistrer')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('Starting save process with positions:', positions)

      // 1. Créer le candidat et enregistrer les positions
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          candidate,
        }),
      })

      const data = await response.json()
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data,
        error: data.error
      })

      if (!response.ok) {
        // Gérer spécifiquement l'erreur de thèmes manquants
        if (data.error && data.error.includes('Missing themes')) {
          const missingThemes = data.error.split('Missing themes: ')[1]
          throw new Error(`Thèmes manquants dans la base de données : ${missingThemes}. Veuillez contacter l'administrateur.`)
        }
        throw new Error(data.error || 'Erreur lors de l\'enregistrement')
      }

      // Vérifier que les positions ont été enregistrées
      if (!data.positions || !Array.isArray(data.positions)) {
        throw new Error('Format de réponse invalide')
      }

      console.log('Positions saved successfully:', data.positions)
      toast.success('Positions enregistrées avec succès')
      
      // Réinitialiser le formulaire
      setCandidate('')
      setText('')
      setPositions([])
      clearFile()
    } catch (err) {
      console.error('Erreur détaillée lors de la sauvegarde:', {
        error: err,
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        stack: err instanceof Error ? err.stack : undefined,
        positions: positions // Log des positions qui n'ont pas pu être sauvegardées
      })
      
      // Message d'erreur plus explicite pour l'utilisateur
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur est survenue lors de la sauvegarde des positions'
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Charger un programme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du candidat
              </label>
              <Input
                id="candidate"
                value={candidate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCandidate(e.target.value)}
                placeholder="Ex: Jean Dupont"
                required
                className="w-full text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programme politique
              </label>
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="w-8 h-8 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-sm text-gray-600">Déposez le fichier ici...</p>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p>Glissez-déposez un fichier PDF ici, ou</p>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary"
                        >
                          cliquez pour sélectionner
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {fileName && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{fileName}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {filePreview && (
                  <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
                    <iframe
                      src={filePreview}
                      className="w-full h-full rounded-lg border border-gray-200"
                      title="Prévisualisation du PDF"
                    />
                  </div>
                )}

                <div className="relative">
                  <Textarea
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                    placeholder="Collez ici le texte du programme politique ou chargez un PDF..."
                    className="min-h-[200px] w-full text-black"
                    required
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !text || !candidate}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyser le programme
                  </>
                )}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde en cours...
                  </>
                ) : (
                  'Sauvegarder'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Positions extraites</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {themes.map((theme) => {
              const themePositions = positions.filter((p) => p.theme === theme.name);
              if (themePositions.length === 0) return null;

              return (
                <Card key={theme.name}>
                  <CardHeader>
                    <CardTitle>{theme.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {themePositions.map((position, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {position.position}
                          </h3>
                          <span className="text-sm text-gray-500">
                            Confiance: {Math.round(position.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{position.summary}</p>
                        <div className="text-xs text-gray-500">
                          Source: {position.source}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Programmes chargés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun programme chargé</p>
            ) : (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{program.title}</h3>
                    <p className="text-sm text-gray-600">
                      Candidat: {program.candidate}
                    </p>
                    <p className="text-xs text-gray-500">
                      Chargé le {new Date(program.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={program.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le PDF
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return;
                        
                        if (!supabase) {
                          toast.error('Erreur de connexion à la base de données');
                          return;
                        }

                        const client = supabase; // Pour éviter les vérifications de null
                        
                        try {
                          // 1. Récupérer le programme pour avoir le chemin du fichier
                          const { data: programData, error: fetchError } = await client
                            .from('programs')
                            .select('file_path')
                            .eq('id', program.id)
                            .single();

                          if (fetchError) throw new Error('Erreur lors de la récupération du programme');

                          // 2. Supprimer le fichier du storage si le chemin existe
                          if (programData?.file_path) {
                            const { error: storageError } = await client.storage
                              .from('pdfs')
                              .remove([programData.file_path]);

                            if (storageError) throw new Error('Erreur lors de la suppression du fichier');
                          }

                          // 3. Supprimer le programme de la base de données
                          const { error: deleteError } = await client
                            .from('programs')
                            .delete()
                            .eq('id', program.id);

                          if (deleteError) throw new Error('Erreur lors de la suppression du programme');

                          toast.success('Programme supprimé avec succès');
                          setPrograms(programs.filter(p => p.id !== program.id));
                        } catch (err) {
                          console.error('Error deleting program:', err);
                          toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression du programme');
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 