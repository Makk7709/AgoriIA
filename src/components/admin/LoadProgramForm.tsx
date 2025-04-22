'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, FileUp, X, FileIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { extractPositionsFromText, validateAndEnrichPositions, type Position } from '@/lib/openai/parse';
import { themes } from '@/lib/openai/config';
import { extractTextFromPDF, isValidPDF } from '@/lib/utils/pdf';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

export function LoadProgramForm() {
  const [candidate, setCandidate] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidPDF = (file: File) => {
    return file.type === 'application/pdf';
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!isValidPDF(file)) {
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
      // Extraction des positions
      const extractedPositions = await extractPositionsFromText(text, candidate);
      
      // Validation et enrichissement
      const validatedPositions = await validateAndEnrichPositions(extractedPositions);
      
      setPositions(validatedPositions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

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
                    className="min-h-[200px]"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
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
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Positions extraites ({positions.length})
          </h2>

          <div className="grid gap-4">
            {themes.map((theme) => {
              const themePositions = positions.filter((p) => p.theme === theme.name);
              if (themePositions.length === 0) return null;

              return (
                <Card key={theme.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{theme.name}</span>
                      <span className="text-sm text-gray-500">
                        ({themePositions.length} position{themePositions.length > 1 ? 's' : ''})
                      </span>
                    </CardTitle>
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setPositions([])}>
              Effacer
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Sauvegarder dans Supabase
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 