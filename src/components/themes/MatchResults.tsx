import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidateScore } from './CandidateScore';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Candidate {
  id: string;
  name: string;
  score: number;
  matchCount: number;
  totalQuestions: number;
}

interface MatchResultsProps {
  candidates: Candidate[];
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function MatchResults({ candidates, className }: MatchResultsProps) {
  // Trier les candidats par score décroissant
  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score);

  return (
    <Card className={className}>
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Résultats de votre matching
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="max-w-xs p-3 text-sm"
              >
                <p>
                  Ces scores sont calculés en fonction de vos réponses aux questions précédentes.
                  Plus le score est élevé, plus vos positions sont proches de celles du candidat.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {sortedCandidates.map((candidate) => (
            <CandidateScore
              key={candidate.id}
              candidate={candidate}
            />
          ))}
        </motion.div>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Score basé sur vos réponses ci-dessus
        </p>
      </CardContent>
    </Card>
  );
} 