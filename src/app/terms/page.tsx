import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - AgorIA',
  description: 'Conditions Générales d\'Utilisation d\'AgorIA, l\'assistant démocratique intelligent.',
}

export default function TermsPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="Conditions Générales d'Utilisation - AgorIA"
        description="Conditions Générales d'Utilisation d'AgorIA, l'assistant démocratique intelligent."
        url="https://agoria.app/terms"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#002654] font-serif">
            📄 Conditions Générales d&apos;Utilisation
          </h1>
        </div>

        <div className="mt-16 prose prose-lg mx-auto text-[#002654]/80">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              1. Objet
            </h2>
            <p className="mt-4">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) ont pour objet de définir les modalités d&apos;accès et d&apos;utilisation du site AgorIA, accessible à l&apos;adresse https://korev-ai.org.
            </p>
            <p className="mt-4">
              En accédant à la plateforme, l&apos;utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepte sans réserve.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              2. Description du service
            </h2>
            <p className="mt-4">
              AgorIA est un service numérique de civic-tech qui permet :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>L&apos;analyse automatisée des programmes électoraux et positions politiques,</li>
              <li>La synthèse thématique des engagements des candidats,</li>
              <li>L&apos;interaction avec un assistant IA neutre et informatif.</li>
            </ul>
            <p className="mt-4">
              Le service est proposé à des fins informatives uniquement. Il ne constitue ni un conseil politique, ni une recommandation électorale, ni un acte de militantisme.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              3. Accès et disponibilité
            </h2>
            <p className="mt-4">
              Le site est accessible gratuitement, sans création de compte.
              L&apos;éditeur se réserve le droit de suspendre ou limiter l&apos;accès temporairement pour maintenance, mise à jour ou en cas de force majeure, sans obligation d&apos;indemnisation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              4. Utilisation conforme et interdictions
            </h2>
            <p className="mt-4">
              L&apos;utilisateur s&apos;engage à :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Utiliser la plateforme dans le respect des lois françaises et européennes,</li>
              <li>Ne pas perturber ou tenter de nuire au bon fonctionnement du service (tentatives d&apos;injection, scraping, DDoS, etc.),</li>
              <li>Ne pas extraire de données de manière automatisée ou à des fins commerciales sans autorisation écrite préalable.</li>
            </ul>
            <p className="mt-4">
              Toute utilisation abusive ou frauduleuse pourra donner lieu à des poursuites judiciaires.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              5. Propriété intellectuelle
            </h2>
            <p className="mt-4">
              Le contenu de la plateforme (textes, analyses, interface, graphismes, base de données, code source, prompts IA, etc.) est protégé par le Code de la propriété intellectuelle.
            </p>
            <p className="mt-4">
              Toute reproduction, diffusion ou extraction sans accord préalable est strictement interdite.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              6. Limitation de responsabilité
            </h2>
            <p className="mt-4">
              AgorIA fournit un service automatisé basé sur des données publiques et des modèles d&apos;intelligence artificielle.
              Malgré le soin apporté aux traitements, aucune garantie n&apos;est donnée sur :
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>L&apos;exhaustivité ou l&apos;actualité des données,</li>
              <li>L&apos;interprétation des résultats par les utilisateurs,</li>
              <li>La fiabilité totale des modèles d&apos;analyse.</li>
            </ul>
            <p className="mt-4">
              L&apos;utilisateur reconnaît utiliser les résultats sous sa seule responsabilité.
              L&apos;éditeur ne saurait être tenu responsable d&apos;une mauvaise interprétation ou d&apos;une décision prise sur la base des informations affichées.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              7. Données personnelles
            </h2>
            <p className="mt-4">
              AgorIA ne collecte aucune donnée personnelle nominative sans consentement explicite.
              Les interactions sont anonymisées et traitées selon les exigences du RGPD.
              Consultez notre <a href="/privacy" className="text-[#002654] hover:text-[#002654]/80 transition-colors duration-200">Politique de confidentialité</a> pour en savoir plus.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              8. Modifications des CGU
            </h2>
            <p className="mt-4">
              Les présentes CGU peuvent être modifiées à tout moment. Les mises à jour prendront effet dès leur publication.
              Les utilisateurs sont invités à les consulter régulièrement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              9. Droit applicable – juridiction compétente
            </h2>
            <p className="mt-4">
              Les présentes conditions sont soumises au droit français.
              En cas de litige, les tribunaux de Grenoble seront seuls compétents.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              10. Contact
            </h2>
            <p className="mt-4">
              Pour toute question, réclamation ou demande d&apos;information, contactez-nous à :<br />
              📧 <a href="mailto:contact@korev-ai.com" className="text-[#002654] hover:text-[#002654]/80 transition-colors duration-200">contact@korev-ai.com</a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
} 