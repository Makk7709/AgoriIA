'use client'

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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

      <div className="space-y-8">
        {Object.entries(MOCK_THEMES).map(([themeId, themeData]) => (
          <motion.div
            key={themeId}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 bg-gradient-to-r from-[#002654] via-white to-[#ED2939] p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#002654]">
                {themeData.name}
              </h2>
              <Badge variant="outline" className="text-sm">
                {themeData.positions.length} position{themeData.positions.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid gap-6">
              {themeData.positions.map((position) => (
                <Card key={position.id} className="border-l-4 border-l-[#002654]">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{position.candidate.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {position.candidate.party}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{position.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 