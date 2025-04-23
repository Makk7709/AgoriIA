import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { BackForwardCache } from "@/components/BackForwardCache";
import { AdminButton } from "@/components/AdminButton";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agoria - Comparateur de programmes politiques',
  description: 'Comparez les programmes politiques des candidats aux élections.',
  icons: {
    icon: '/favicon.ico'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <StructuredData
          type="WebSite"
          name="Korev AI"
          description="Comparez les programmes politiques et analysez les positions des candidats avec l'aide de l'IA."
          url="https://agoria.app"
        />
      </head>
      <body className={inter.className}>
        <BackForwardCache />
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-[#002654]/10 bg-white/80 backdrop-blur-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center group">
                    <span className="text-2xl font-bold font-serif text-[#001a3d] relative">
                      Korev AI
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#001a3d] via-white to-[#EF4135] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                    </span>
                  </Link>
                  <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                    <Link
                      href="/themes"
                      className="inline-flex items-center px-3 py-2 text-base font-serif font-medium text-[#002654]/80 hover:text-[#002654] hover:bg-[#002654]/5 rounded-lg transition-colors"
                    >
                      Thèmes
                    </Link>
                    <Link
                      href="/compare"
                      className="inline-flex items-center px-3 py-2 text-base font-serif font-medium text-[#002654]/80 hover:text-[#002654] hover:bg-[#002654]/5 rounded-lg transition-colors"
                    >
                      Comparer
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <AdminButton />
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-white border-t border-[#002654]/10">
            <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
              <div className="flex justify-center space-x-6 md:order-2">
                <Link href="/about" className="text-[#002654]/60 hover:text-[#002654] transition-colors font-serif">
                  À propos
                </Link>
                <Link href="/privacy" className="text-[#002654]/60 hover:text-[#002654] transition-colors font-serif">
                  Confidentialité
                </Link>
                <Link href="/terms" className="text-[#002654]/60 hover:text-[#002654] transition-colors font-serif">
                  Conditions
                </Link>
                <Link href="/thanks" className="text-[#002654]/60 hover:text-[#002654] transition-colors font-serif">
                  Remerciements
                </Link>
              </div>
              <div className="mt-1 md:mt-0 md:order-1">
                <p className="text-center text-base text-[#002654]/60 font-serif">
                  &copy; {new Date().getFullYear()} Korev AI. Tous droits réservés.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
