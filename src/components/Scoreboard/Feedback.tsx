import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreAnalysis, generateScoreFeedback } from '@/lib/openai/feedback';
import { Loader2 } from 'lucide-react';

interface FeedbackProps {
  userResponses: Record<string, string>;
  candidateScores: Record<string, number>;
  candidatePositions: Record<string, Record<string, string>>;
}

export function Feedback({ userResponses, candidateScores, candidatePositions }: FeedbackProps) {
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const result = await generateScoreFeedback(
          userResponses,
          candidateScores,
          candidatePositions
        );
        setAnalysis(result);
      } catch (err) {
        setError('Erreur lors de la génération de l\'analyse');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [userResponses, candidateScores, candidatePositions]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Génération de l'analyse...</span>
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
      <CardHeader>
        <CardTitle>Analyse de vos résultats</CardTitle>
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