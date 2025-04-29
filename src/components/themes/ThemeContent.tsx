'use client'

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, sanitizePositionContent, logContentDebug } from '@/lib/utils';
import type { Theme, Position } from '@/lib/types';

// Données temporaires pour le MVP
const MOCK_THEMES = {
  'education': {
    id: 'education',
    name: 'Éducation et Culture',
    positions: [
      {
        id: '1',
        theme_id: 'education',
        content: 'Le programme propose la création de 200 000 places en crèches, le recrutement de 65 000 enseignants avec une revalorisation de leur salaire, l\'offre de repas 100% bio et locaux dans les cantines, la création de 100 000 places universitaires, la suppression de Parcoursup, et une augmentation du budget de la culture de un milliard d\'euros.',
        candidate: { name: 'Jean-Luc Mélenchon', party: 'LFI' }
      }
    ]
  },
  'sante': {
    id: 'sante',
    name: 'Santé',
    positions: [
      {
        id: '2',
        theme_id: 'sante',
        content: 'Le programme inclut la reconnaissance du burn-out comme maladie professionnelle, un plan d\'urgence pour l\'hôpital public avec l\'embauche de 100 000 infirmiers et la revalorisation des salaires, la lutte contre les déserts médicaux, l\'interdiction de la création d\'EHPAD à but lucratif, et le droit à une fin de vie choisie et apaisée.',
        candidate: { name: 'Anne Hidalgo', party: 'PS' }
      }
    ]
  },
  'europe': {
    id: 'europe',
    name: 'Europe',
    positions: [
      {
        id: '3',
        theme_id: 'europe',
        content: 'Le programme souligne l\'importance de l\'Europe dans la lutte contre le changement climatique, les crises économiques, et pour garantir l\'indépendance énergétique, industrielle et alimentaire de l\'Europe face aux dictatures.',
        candidate: { name: 'Yannick Jadot', party: 'EELV' }
      }
    ]
  },
  'institutions': {
    id: 'institutions',
    name: 'Institutions',
    positions: [
      {
        id: '4',
        theme_id: 'institutions',
        content: 'Le programme propose de mettre fin au présidentialisme, de séparer les lobbies de l\'État, et de développer la démocratie citoyenne, visant à renforcer la participation des citoyens dans le processus décisionnel.',
        candidate: { name: 'François Ruffin', party: 'LFI' }
      }
    ]
  }
};

interface ThemeContentProps {
  theme: Theme;
  positions: Position[];
  className?: string;
}

export function ThemeContent({ theme, positions, className }: ThemeContentProps) {
  // Regrouper les positions par candidat et garder la plus récente
  const latestPositionsByCandidate = positions.reduce((acc, position) => {
    const existingPosition = acc.get(position.candidate_id);
    if (!existingPosition || new Date(position.created_at) > new Date(existingPosition.created_at)) {
      acc.set(position.candidate_id, position);
    }
    return acc;
  }, new Map<string, Position>());

  // Convertir la Map en array pour l'affichage
  const uniquePositions = Array.from(latestPositionsByCandidate.values());

  return (
    <div className={cn('space-y-8', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl font-bold font-serif tracking-tight text-[#002654] sm:text-5xl mb-4">
          {theme.name}
        </h1>
        {theme.description && (
          <p className="mt-2 text-xl text-[#002654]/80 font-serif">
            {theme.description}
          </p>
        )}
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {uniquePositions.length > 0 ? (
          <div className="space-y-6">
            {uniquePositions.map((position, index) => {
              // Nettoyer le contenu avant l'affichage
              const cleanContent = sanitizePositionContent(position.content);
              logContentDebug(cleanContent, `ThemeContent-${position.id}`);

              return (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-[#002654]/10 hover:border-[#002654]/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-[#002654]/10">
                          <AvatarFallback className="bg-gradient-to-br from-[#002654] to-[#EF4135] text-white">
                            {position.candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-[#002654] truncate">
                                {position.candidate.name}
                              </h3>
                              <Badge variant="outline" className="bg-[#002654]/5 text-[#002654]">
                                {position.candidate.party}
                              </Badge>
                            </div>
                          </div>
                          <p className="mt-4 text-[#002654]/80 text-base leading-relaxed whitespace-pre-wrap">
                            {cleanContent}
                          </p>
                          {position.source_url && (
                            <a
                              href={position.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center text-sm text-[#002654]/60 hover:text-[#002654] transition-colors"
                            >
                              Source
                              <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-[#002654]/60 font-serif">
              Aucune position n'a encore été enregistrée pour ce thème.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 