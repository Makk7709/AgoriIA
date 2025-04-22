import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Theme {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Position {
  id: string;
  theme_id: string;
  title: string;
  description: string | null;
  content: string | null;
  source_url: string | null;
  created_at: string;
  candidate_positions?: {
    candidate: {
      id: string;
      name: string;
      party: string;
    }[];
  }[];
}

interface ThemeContentProps {
  theme: Theme;
  positions: Position[];
}

export function ThemeContent({ theme, positions }: ThemeContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">{theme.name}</h1>
        {theme.description && (
          <p className="text-lg text-gray-600">{theme.description}</p>
        )}
      </div>

      <div className="grid gap-6">
        {positions.map((position) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{position.title}</CardTitle>
                  {position.candidate_positions?.map((cp) => (
                    <div key={cp.candidate[0].id} className="flex items-center gap-2">
                      <Badge variant="outline">{cp.candidate[0].party}</Badge>
                      <span className="text-sm text-gray-600">{cp.candidate[0].name}</span>
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {position.description && (
                    <p className="text-gray-600">{position.description}</p>
                  )}
                  {position.content && (
                    <p className="text-gray-700">{position.content}</p>
                  )}
                  {position.source_url && (
                    <a
                      href={position.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Source
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 