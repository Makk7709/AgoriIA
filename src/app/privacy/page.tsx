import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - AgorIA',
  description: 'Politique de confidentialité d\'AgorIA, l\'assistant démocratique intelligent.',
}

export default function PrivacyPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="Politique de confidentialité - AgorIA"
        description="Politique de confidentialité d'AgorIA, l'assistant démocratique intelligent."
        url="https://www.korev-ai.org/privacy"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Comment nous protégeons vos données
          </p>
        </div>

        <div className="mt-12 prose prose-indigo prose-lg mx-auto">
          <p>
            Chez AgorIA, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
          
          <h2>Informations que nous collectons</h2>
          <p>
            Nous collectons uniquement les informations nécessaires au fonctionnement de l&apos;application :
          </p>
          <ul>
            <li>Vos réponses aux questionnaires sur les thèmes politiques</li>
            <li>Vos préférences de navigation</li>
            <li>Des informations techniques (navigateur, appareil, etc.)</li>
          </ul>
          
          <h2>Comment nous utilisons vos informations</h2>
          <p>
            Nous utilisons vos informations pour :
          </p>
          <ul>
            <li>Personnaliser votre expérience</li>
            <li>Améliorer nos services</li>
            <li>Analyser les tendances d&apos;utilisation</li>
          </ul>
          
          <h2>Protection de vos données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération.
          </p>
          
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement</li>
            <li>Droit à la portabilité</li>
          </ul>
          
          <h2>Contact</h2>
          <p>
            Pour toute question concernant notre politique de confidentialité, contactez-nous à <a href="mailto:contact@korev-ai.com">contact@korev-ai.com</a>.
          </p>
        </div>
      </div>
    </>
  )
} 