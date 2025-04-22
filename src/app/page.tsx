import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          AgorIA
        </h1>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <p className="text-sm text-gray-500">
            Votre assistant démocratique intelligent
          </p>
        </div>
      </div>

      <div className="my-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Comparez les programmes politiques simplement
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Découvrez et analysez les positions des candidats sur les sujets qui vous importent,
          avec l&apos;aide de l&apos;intelligence artificielle pour une compréhension plus claire et objective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Choisissez un thème</h3>
            <p className="text-sm text-gray-600">
              Écologie, économie, santé... Explorez les sujets qui vous intéressent.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Comparez les positions</h3>
            <p className="text-sm text-gray-600">
              Visualisez clairement les différences entre les programmes.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Analyse IA</h3>
            <p className="text-sm text-gray-600">
              Obtenez des résumés objectifs et des scores d&apos;alignement.
            </p>
          </div>
        </div>

        <Link
          href="/themes"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Découvrir les thèmes
          <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Objectif
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Faciliter la compréhension des enjeux politiques pour tous les citoyens.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Neutralité
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Une analyse objective et impartiale des programmes politiques.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Innovation
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            L&apos;IA au service de la démocratie et de la participation citoyenne.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Accessibilité
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Une interface simple et intuitive pour tous les utilisateurs.
          </p>
        </div>
      </div>
    </main>
  )
}
