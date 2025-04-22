import { motion } from 'framer-motion';
import { LucideIcon, ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ThemeHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  themeId: string;
  totalThemes: number;
  currentThemeIndex: number;
}

export function ThemeHeader({
  title,
  description,
  icon: Icon,
  className,
  themeId,
  totalThemes,
  currentThemeIndex,
}: ThemeHeaderProps) {
  const nextThemeIndex = (currentThemeIndex + 1) % totalThemes;
  const prevThemeIndex = (currentThemeIndex - 1 + totalThemes) % totalThemes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-4xl mx-auto px-4 py-8 space-y-6',
        'bg-white rounded-lg shadow-sm border border-gray-100',
        className
      )}
      role="banner"
      aria-label={`Thème : ${title}`}
    >
      {/* Navigation */}
      <nav 
        className="flex items-center justify-between text-sm text-gray-700" 
        aria-label="Navigation principale"
      >
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
            aria-label="Retour à l'accueil"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Accueil</span>
          </Link>
          <span className="text-gray-400" aria-hidden="true">/</span>
          <Link 
            href="/themes" 
            className="hover:text-gray-900 transition-colors"
            aria-label="Retour à la liste des thèmes"
          >
            Thèmes
          </Link>
          <span className="text-gray-400" aria-hidden="true">/</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-700">
            {currentThemeIndex + 1} sur {totalThemes}
          </span>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="flex items-start gap-6">
        <div 
          className="p-4 rounded-full bg-gray-100 text-gray-800"
          aria-hidden="true"
        >
          <Icon className="w-8 h-8" />
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-gray-700 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Navigation entre les thèmes */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-gray-700 hover:text-gray-900"
              aria-label={`Voir le thème précédent (${prevThemeIndex + 1} sur ${totalThemes})`}
            >
              <Link href={`/themes/${prevThemeIndex}`}>
                <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Thème précédent
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-gray-700 hover:text-gray-900"
              aria-label={`Voir le thème suivant (${nextThemeIndex + 1} sur ${totalThemes})`}
            >
              <Link href={`/themes/${nextThemeIndex}`}>
                Thème suivant
                <ChevronLeft className="w-4 h-4 ml-2 rotate-180" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="flex items-center gap-4 text-sm text-gray-700 pt-4 border-t border-gray-100">
        <span className="font-medium">Thème politique</span>
        <span className="text-gray-400" aria-hidden="true">•</span>
        <span>Comparaison des positions</span>
        <span className="text-gray-400" aria-hidden="true">•</span>
        <span>Mis à jour le {new Date().toLocaleDateString('fr-FR')}</span>
      </div>
    </motion.div>
  );
} 