import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { ChatPanel } from '@/components/ChatPanel'
import { About } from '@/components/About'

export const metadata: Metadata = {
  title: 'AgorIA - Assistant démocratique intelligent',
  description: 'Comparez les programmes politiques et analysez les positions des candidats avec l\'aide de l\'IA.',
  openGraph: {
    title: 'AgorIA - Assistant démocratique intelligent',
    description: 'Comparez les programmes politiques et analysez les positions des candidats avec l\'aide de l\'IA.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AgorIA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgorIA - Assistant démocratique intelligent',
    description: 'Comparez les programmes politiques et analysez les positions des candidats avec l\'aide de l\'IA.',
  },
}

export default function Home() {
  return (
    <>
      <StructuredData
        type="WebPage"
        name="AgorIA - Assistant démocratique intelligent"
        description="Comparez les programmes politiques et analysez les positions des candidats avec l'aide de l'IA."
        url="https://agoria.app"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="z-10 w-full max-w-5xl mb-16 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#002654] font-serif relative group">
              AgorIA
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-[#002654] via-white to-[#EF4135] transform scale-x-100 group-hover:scale-x-110 transition-transform duration-300 ease-in-out"></span>
            </h1>
            <div className="flex flex-col items-center gap-3">
              <p className="text-2xl md:text-3xl text-[#002654]/90 font-serif italic">
                Votre assistant démocratique intelligent
              </p>
              <p className="text-xl md:text-2xl text-[#002654]/80 font-serif tracking-wider">
                Liberté • Égalité • Fraternité
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl backdrop-blur-sm bg-white/50 rounded-2xl shadow-lg border border-white/20 p-6">
          <ChatPanel />
        </div>

        <About />

        <div className="mt-16 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left gap-6">
          <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
              Objectif
            </h2>
            <p className="m-0 max-w-[30ch] text-base text-[#002654]/80">
              Faciliter la compréhension des enjeux politiques pour tous les citoyens.
            </p>
          </div>

          <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
              Neutralité
            </h2>
            <p className="m-0 max-w-[30ch] text-base text-[#002654]/80">
              Une analyse objective et impartiale des programmes politiques.
            </p>
          </div>

          <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
              Innovation
            </h2>
            <p className="m-0 max-w-[30ch] text-base text-[#002654]/80">
              L&apos;IA au service de la démocratie et de la participation citoyenne.
            </p>
          </div>

          <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
              Accessibilité
            </h2>
            <p className="m-0 max-w-[30ch] text-base text-[#002654]/80">
              Une interface simple et intuitive pour tous les utilisateurs.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
