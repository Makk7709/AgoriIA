import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandidatePosition } from './CandidatePosition';

interface Position {
  id: string;
  title: string;
  description: string;
  candidates: {
    id: string;
    name: string;
    position: 'agree' | 'disagree' | 'neutral';
    explanation: string;
  }[];
}

interface ComparisonGridProps {
  positions: Position[];
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

export function ComparisonGrid({ positions, className }: ComparisonGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {positions.map((position) => (
        <Card key={position.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {position.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-6">
              {position.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {position.candidates.map((candidate) => (
                <CandidatePosition
                  key={candidate.id}
                  candidate={candidate}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
} 