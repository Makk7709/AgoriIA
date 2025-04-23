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
        url="https://agoria.app/privacy"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#002654] font-serif">
            🔐 Politique de confidentialité
          </h1>
          <p className="mt-6 text-xl text-[#002654]/80">
            Chez <strong>AgorIA</strong>, la protection de vos données est une priorité.
          </p>
        </div>

        <div className="mt-16 prose prose-lg mx-auto text-[#002654]/80">
          <section className="mb-12">
            <p className="mt-4">
              Nous collectons uniquement les informations strictement nécessaires à l&apos;analyse des préférences citoyennes :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Aucune donnée personnelle nominative (nom, email, adresse...) n&apos;est stockée sans votre consentement explicite.</li>
              <li>Les réponses à nos questionnaires sont anonymisées et utilisées uniquement à des fins statistiques ou de recommandation personnalisée.</li>
              <li>Vos interactions avec l&apos;assistant IA sont traitées localement ou via des API sécurisées, sans revente ni exploitation commerciale.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🔒 Hébergement & sécurité
            </h2>
            <p className="mt-4">
              Nos serveurs sont hébergés en Europe (conformité RGPD), avec chiffrement des données en transit et en base.
            </p>
            <p className="mt-4">
              Des audits réguliers sont réalisés pour assurer la sécurité des échanges et la confidentialité des informations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🧾 Vos droits
            </h2>
            <p className="mt-4">
              Conformément à la réglementation en vigueur (RGPD), vous pouvez :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Accéder à vos données</li>
              <li>Demander leur suppression</li>
              <li>Modifier vos préférences de confidentialité à tout moment</li>
            </ul>
          </section>

          <section className="mb-12">
            <p className="mt-4">
              Pour toute demande, contactez-nous à : <a href="mailto:contact@korev-ai.com" className="text-[#002654] hover:text-[#002654]/80 transition-colors duration-200">contact@korev-ai.com</a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
} 