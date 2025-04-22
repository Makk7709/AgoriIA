import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CandidatePositionProps {
  candidate: {
    id: string;
    name: string;
    position: 'agree' | 'disagree' | 'neutral';
    explanation: string;
  };
  className?: string;
}

const positionIcons = {
  agree: Check,
  disagree: X,
  neutral: Minus,
};

const positionColors = {
  agree: 'bg-green-50 text-green-800 border-green-200',
  disagree: 'bg-red-50 text-red-800 border-red-200',
  neutral: 'bg-gray-50 text-gray-800 border-gray-200',
};

export function CandidatePosition({ candidate, className }: CandidatePositionProps) {
  const Icon = positionIcons[candidate.position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border transition-colors',
        positionColors[candidate.position],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {candidate.name}
            </h3>
            <Badge
              variant="outline"
              className={cn(
                'text-xs py-1 px-2',
                positionColors[candidate.position]
              )}
            >
              {candidate.position === 'agree'
                ? 'D\'accord'
                : candidate.position === 'disagree'
                ? 'Pas d\'accord'
                : 'Neutre'}
            </Badge>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {candidate.explanation}
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-xs p-3 text-sm"
              >
                <p>{candidate.explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
} 