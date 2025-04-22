import type { AIAnalysis } from '@/lib/openai/summarize'

interface AIAnalysisProps {
  analysis: AIAnalysis | null
  isLoading?: boolean
}

export function AIAnalysis({ analysis, isLoading = false }: AIAnalysisProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Analyse IA des positions
        </h3>

        <div className="prose max-w-none">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-gray-900">Résumé</h4>
              <p className="mt-2 text-gray-600">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900">Points de convergence</h4>
              <ul className="mt-2 list-disc pl-5 text-gray-600">
                {analysis.convergences.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900">Points de divergence</h4>
              <ul className="mt-2 list-disc pl-5 text-gray-600">
                {analysis.divergences.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <div className="text-sm text-gray-500">
              Indice de confiance : {analysis.confidence}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 