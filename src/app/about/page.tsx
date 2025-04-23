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
        url="https://agoria.app/about"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#002654] font-serif">
            🏛️ À propos d&apos;AgorIA
          </h1>
          <p className="mt-6 text-xl text-[#002654]/80">
            <strong>AgorIA est un assistant citoyen propulsé par l&apos;intelligence artificielle</strong>, conçu pour permettre à chacun de mieux comprendre les positions politiques, comparer les programmes électoraux et prendre des décisions éclairées.
          </p>
        </div>

        <div className="mt-16 prose prose-lg mx-auto text-[#002654]/80">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🎯 Notre mission
            </h2>
            <p className="mt-4">
              AgorIA est né d&apos;un constat simple : l&apos;information politique est souvent <strong>trop complexe, trop dispersée, ou trop orientée</strong>.
            </p>
            <p className="mt-4">
              Notre ambition est de <strong>redonner du pouvoir aux citoyens</strong>, en leur offrant un accès simplifié, transparent et neutre aux données politiques majeures :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Programmes électoraux</li>
              <li>Positions thématiques des candidats</li>
              <li>Engagements tenus ou non réalisés</li>
              <li>Alignement entre les idées des électeurs et des politiques</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              ⚙️ Comment ça fonctionne ?
            </h2>
            <p className="mt-4">
              AgorIA utilise le traitement du langage naturel (NLP) pour :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Classer les promesses par thème</li>
              <li>Résumer et reformuler les propositions</li>
              <li>Détecter les promesses non tenues</li>
              <li>Répondre via un assistant conversationnel neutre</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              💡 Une IA engagée… mais pas engagée politiquement
            </h2>
            <p className="mt-4">
              AgorIA n&apos;est affilié à aucun parti.<br />
              Notre seule fidélité : la <strong>transparence démocratique</strong>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🤝 Une initiative pour tous
            </h2>
            <p className="mt-4">
              AgorIA est conçu pour les citoyens, étudiants, journalistes, enseignants et électeurs exigeants.
            </p>
            <p className="mt-4 text-xl font-semibold">
              <strong>Reprenons ensemble le pouvoir de comprendre.</strong>
            </p>
          </section>
        </div>
      </div>
    </>
  )
} 