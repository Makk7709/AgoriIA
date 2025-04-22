import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation - AgorIA',
  description: 'Conditions d\'utilisation d\'AgorIA, l\'assistant démocratique intelligent.',
}

export default function TermsPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="Conditions d'utilisation - AgorIA"
        description="Conditions d'utilisation d'AgorIA, l'assistant démocratique intelligent."
        url="https://www.korev-ai.org/terms"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Conditions d&apos;utilisation
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Les règles d&apos;utilisation d&apos;AgorIA
          </p>
        </div>

        <div className="mt-12 prose prose-indigo prose-lg mx-auto">
          <p>
            En utilisant AgorIA, vous acceptez les conditions d&apos;utilisation suivantes. Veuillez les lire attentivement avant d&apos;utiliser notre service.
          </p>
          
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant à AgorIA, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
          
          <h2>2. Utilisation du service</h2>
          <p>
            AgorIA est un outil d&apos;information et d&apos;analyse politique. Les analyses fournies sont basées sur des données publiques et ne constituent pas des conseils politiques ou juridiques.
          </p>
          
          <h2>3. Propriété intellectuelle</h2>
          <p>
            Le contenu d&apos;AgorIA, y compris les textes, graphiques, logos et logiciels, est la propriété de Korev AI SAS et est protégé par les lois sur la propriété intellectuelle.
          </p>
          
          <h2>4. Limitation de responsabilité</h2>
          <p>
            AgorIA est fourni &quot;tel quel&quot;, sans garantie d&apos;aucune sorte. Nous ne sommes pas responsables des décisions prises sur la base des informations fournies par notre service.
          </p>
          
          <h2>5. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
          </p>
          
          <h2>6. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à <a href="mailto:contact@korev-ai.com">contact@korev-ai.com</a>.
          </p>
        </div>
      </div>
    </>
  )
} 