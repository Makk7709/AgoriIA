import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CandidateScoreProps {
  candidate: {
    id: string;
    name: string;
    score: number;
    matchCount: number;
    totalQuestions: number;
  };
  className?: string;
}

export function CandidateScore({ candidate, className }: CandidateScoreProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border border-gray-200 bg-white',
        className
      )}
    >
      <div className="space-y-3">
        {/* En-tête avec nom et score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              {candidate.name}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Scale className="w-4 h-4 text-gray-400" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-xs p-3 text-sm"
                >
                  <p>
                    Score calculé sur {candidate.matchCount} positions communes
                    sur {candidate.totalQuestions} questions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-base font-medium text-gray-800">
            {candidate.score}%
          </span>
        </div>

        {/* Barre de progression */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${candidate.score}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-neutral-600"
            role="progressbar"
            aria-label={`Score de compatibilité avec ${candidate.name}`}
            aria-valuenow={candidate.score}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Légende */}
        <p className="text-xs text-gray-500">
          {candidate.matchCount} positions communes sur {candidate.totalQuestions} questions
        </p>
      </div>
    </motion.div>
  );
} 