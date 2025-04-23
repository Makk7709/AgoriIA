import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Theme, Position } from '@/lib/types';

interface ThemeContentProps {
  theme: Theme;
  positions: Position[];
}

export function ThemeContent({ theme, positions }: ThemeContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{theme.name}</h1>
        {theme.description && (
          <p className="text-gray-600">{theme.description}</p>
        )}
      </div>

      <div className="grid gap-6">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {position.candidate?.name} - {position.candidate?.party}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{position.content}</p>
              {position.source_url && (
                <a
                  href={position.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Source
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 