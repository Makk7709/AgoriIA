import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Remerciements - AgorIA',
  description: 'Remerciements aux contributeurs et partenaires d\'AgorIA.',
}

export default function ThanksPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="Remerciements - AgorIA"
        description="Remerciements aux contributeurs et partenaires d'AgorIA."
        url="https://agoria.app/thanks"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#002654] font-serif">
            🙏 Remerciements
          </h1>
          <p className="mt-6 text-xl text-[#002654]/80">
            AgorIA est le fruit d'une collaboration entre plusieurs personnes passionnées par la démocratie et l'innovation.
          </p>
        </div>

        <div className="mt-16 prose prose-lg mx-auto text-[#002654]/80">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🌟 Remerciements Spéciaux
            </h2>
            <p className="mt-4">
              Un remerciement tout particulier à <strong>Lena Gaubert</strong> pour son idée visionnaire et son inspiration dans la création d'AgorIA. Son engagement pour une démocratie plus accessible et transparente a été le catalyseur de ce projet.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              🤝 Nos Partenaires
            </h2>
            <p className="mt-4">
              Nous remercions chaleureusement nos partenaires qui nous soutiennent dans cette aventure : la société Kirving et son dirigeant Loic Meyer
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#002654] font-serif flex items-center gap-2">
              💡 Notre Vision
            </h2>
            <p className="mt-4">
              AgorIA continue d'évoluer grâce à la contribution de tous. Notre objectif est de rendre l'information politique plus accessible et transparente pour tous les citoyens.
            </p>
          </section>
        </div>
      </div>
    </>
  )
} 