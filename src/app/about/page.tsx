import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'À propos - AgorIA',
  description: 'Découvrez AgorIA, l\'assistant démocratique intelligent qui vous aide à comprendre les programmes politiques.',
}

export default function AboutPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="À propos - AgorIA"
        description="Découvrez AgorIA, l'assistant démocratique intelligent qui vous aide à comprendre les programmes politiques."
        url="https://www.korev-ai.org/about"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            À propos d&apos;AgorIA
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Votre assistant démocratique intelligent
          </p>
        </div>

        <div className="mt-12 prose prose-indigo prose-lg mx-auto">
          <p>
            AgorIA est une application civic-tech développée par Korev AI qui utilise l&apos;intelligence artificielle pour aider les citoyens à comparer les positions des candidats politiques sur différents thèmes.
          </p>
          
          <h2>Notre mission</h2>
          <p>
            Notre mission est de faciliter la compréhension des enjeux politiques pour tous les citoyens, en fournissant une analyse objective et impartiale des programmes politiques.
          </p>
          
          <h2>Notre approche</h2>
          <p>
            Nous utilisons l&apos;intelligence artificielle pour analyser les positions des candidats et fournir des résumés objectifs et des scores d&apos;alignement. Notre objectif est de rendre l&apos;information politique plus accessible et plus facile à comprendre.
          </p>
          
          <h2>Notre équipe</h2>
          <p>
            AgorIA est développé par une équipe passionnée de développeurs, de data scientists et de spécialistes en sciences politiques, tous engagés à améliorer la démocratie participative.
          </p>
          
          <h2>Contact</h2>
          <p>
            Pour toute question ou suggestion, n&apos;hésitez pas à nous contacter à <a href="mailto:contact@korev-ai.com">contact@korev-ai.com</a>.
          </p>
        </div>
      </div>
    </>
  )
} 