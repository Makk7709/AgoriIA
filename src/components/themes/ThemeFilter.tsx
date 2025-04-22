import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SortOption = 'relevance' | 'alphabetical' | 'date';
export type FilterOption = 'all' | 'agree' | 'disagree' | 'neutral';

interface ThemeFilterProps {
  onSearch: (query: string) => void;
  onSort: (option: SortOption) => void;
  onFilter: (option: FilterOption) => void;
  className?: string;
  totalResults: number;
}

export function ThemeFilter({
  onSearch,
  onSort,
  onFilter,
  className,
  totalResults,
}: ThemeFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'w-full max-w-4xl mx-auto px-4 py-6',
        'bg-white rounded-lg shadow-sm border border-gray-100',
        className
      )}
      role="search"
      aria-label="Filtres de recherche"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher dans les positions..."
            className="pl-10"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
            aria-label="Rechercher dans les positions"
          />
        </div>

        {/* Filtres et tri */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Select onValueChange={(value: string) => onFilter(value as FilterOption)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrer par position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les positions</SelectItem>
              <SelectItem value="agree">Positions d'accord</SelectItem>
              <SelectItem value="disagree">Positions en désaccord</SelectItem>
              <SelectItem value="neutral">Positions neutres</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value: string) => onSort(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Pertinence</SelectItem>
              <SelectItem value="alphabetical">Alphabétique</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Résultats */}
      <div className="mt-4 text-sm text-gray-500">
        {totalResults} position{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
      </div>
    </motion.div>
  );
} 