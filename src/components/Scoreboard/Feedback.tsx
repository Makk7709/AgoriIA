import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScoreAnalysis, generateScoreFeedback } from '@/lib/openai/feedback';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Eye, Loader2 } from 'lucide-react';
import type { AnsweredPosition } from '@/lib/types';

interface FeedbackProps {
  answeredPositions: AnsweredPosition[];
  candidateScores: Record<string, number>;
}

export function Feedback({ 
  answeredPositions,
  candidateScores
}: FeedbackProps) {
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalysis() {
      if (!answeredPositions || !candidateScores) {
        setError('Données manquantes pour l\'analyse');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Convertir les données au format attendu par generateScoreFeedback
        const userResponses = Object.fromEntries(
          answeredPositions.map(({ position, userResponse }) => [position.id, userResponse])
        );

        const candidatePositions = Object.fromEntries(
          answeredPositions.map(({ position }) => [
            position.candidate.name,
            { [position.id]: position.content }
          ])
        );

        const result = await generateScoreFeedback(
          userResponses,
          candidateScores,
          candidatePositions
        );
        
        if (isMounted) {
          setAnalysis(result);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors de la génération de l\'analyse');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      isMounted = false;
    };
  }, [answeredPositions, candidateScores]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Génération de l'analyse en cours...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analyse de vos résultats</CardTitle>
        <Dialog open={showResponses} onOpenChange={setShowResponses}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Revoir mes réponses
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vos réponses</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {answeredPositions.map(({ position, userResponse }) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{position.content}</h3>
                  <p className="text-muted-foreground">
                    Votre réponse : {userResponse === 'agree' ? '✅ D\'accord' : 
                      userResponse === 'disagree' ? '❌ Pas d\'accord' : '⚪ Neutre'}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Candidat le plus proche</h3>
          <p>{analysis.closestCandidate}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Domaines d'accord</h3>
          <ul className="list-disc pl-4">
            {analysis.agreementAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Domaines de désaccord</h3>
          <ul className="list-disc pl-4">
            {analysis.disagreementAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Conseils d'exploration</h3>
          <p>{analysis.explorationAdvice}</p>
        </div>
      </CardContent>
    </Card>
  );
} 