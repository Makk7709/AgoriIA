import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgorIA - Assistant démocratique intelligent",
  description: "Comparez les programmes politiques et analysez les positions des candidats avec l'aide de l'IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold text-indigo-600">AgorIA</span>
                  </Link>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/themes"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      Thèmes
                    </Link>
                    <Link
                      href="/compare"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      Comparer
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
              <div className="flex justify-center space-x-6 md:order-2">
                <Link href="/about" className="text-gray-400 hover:text-gray-500">
                  À propos
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
                  Confidentialité
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-gray-500">
                  Conditions
                </Link>
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-base text-gray-400">
                  &copy; {new Date().getFullYear()} AgorIA. Tous droits réservés.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
