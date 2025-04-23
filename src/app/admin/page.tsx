import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: 'Administration - Agoria',
  description: 'Interface d\'administration d\'Agoria'
}

export default async function AdminDashboard() {
  // Récupérer les statistiques
  const [themesCount, candidatesCount, positionsCount] = await Promise.all([
    supabase.from('themes').select('id', { count: 'exact' }),
    supabase.from('candidates').select('id', { count: 'exact' }),
    supabase.from('positions').select('id', { count: 'exact' })
  ])

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#002654]">
              Dashboard Administrateur
            </h1>
            <p className="mt-2 text-[#002654]/60">
              Gérez les candidats, les thèmes et les positions
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/candidates"
              className="px-6 py-3 rounded-xl bg-[#002654] text-white hover:bg-[#001b3b] transition-colors"
            >
              Gérer les candidats
            </Link>
            <Link
              href="/admin/themes"
              className="px-6 py-3 rounded-xl bg-[#EF4135] text-white hover:bg-[#d93a2f] transition-colors"
            >
              Gérer les thèmes
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#002654]">
                {candidatesCount.count || 0}
              </CardTitle>
              <CardDescription>Candidats enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[#002654]/60">
                Gérez les profils des candidats et leurs informations
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#002654]">
                {themesCount.count || 0}
              </CardTitle>
              <CardDescription>Thèmes disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[#002654]/60">
                Organisez les sujets politiques par catégories
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#002654]">
                {positionsCount.count || 0}
              </CardTitle>
              <CardDescription>Positions enregistrées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[#002654]/60">
                Suivez les positions des candidats sur chaque thème
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-white border-b border-[#002654]/10">
            <TabsTrigger value="overview" className="text-lg font-serif">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-lg font-serif">
              Activité récente
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-lg font-serif">
              Outils
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#002654]">
                    Couverture des thèmes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Économie</span>
                      <div className="w-2/3 bg-[#002654]/10 rounded-full h-2">
                        <div className="bg-[#002654] h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Écologie</span>
                      <div className="w-2/3 bg-[#002654]/10 rounded-full h-2">
                        <div className="bg-[#002654] h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Social</span>
                      <div className="w-2/3 bg-[#002654]/10 rounded-full h-2">
                        <div className="bg-[#002654] h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#002654]">
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link
                      href="/admin/candidates/new"
                      className="flex items-center p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors group"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-[#002654] group-hover:text-[#001b3b]">
                          Ajouter un candidat
                        </h3>
                        <p className="text-sm text-[#002654]/60">
                          Créer un nouveau profil de candidat
                        </p>
                      </div>
                      <svg className="w-6 h-6 text-[#002654]/40 group-hover:text-[#002654]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      href="/admin/positions/new"
                      className="flex items-center p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors group"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-[#002654] group-hover:text-[#001b3b]">
                          Ajouter une position
                        </h3>
                        <p className="text-sm text-[#002654]/60">
                          Enregistrer une nouvelle position politique
                        </p>
                      </div>
                      <svg className="w-6 h-6 text-[#002654]/40 group-hover:text-[#002654]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#002654]">
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Liste des activités récentes */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#002654]/5">
                    <div className="w-2 h-2 rounded-full bg-[#002654]"></div>
                    <div className="flex-1">
                      <p className="text-[#002654]">Positions ajoutées pour Yannick Jadot</p>
                      <p className="text-sm text-[#002654]/60">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#002654]/5">
                    <div className="w-2 h-2 rounded-full bg-[#002654]"></div>
                    <div className="flex-1">
                      <p className="text-[#002654]">Positions ajoutées pour Nathalie Arthaud</p>
                      <p className="text-sm text-[#002654]/60">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#002654]/5">
                    <div className="w-2 h-2 rounded-full bg-[#EF4135]"></div>
                    <div className="flex-1">
                      <p className="text-[#002654]">Thèmes standardisés</p>
                      <p className="text-sm text-[#002654]/60">Il y a 3 heures</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#002654]">
                    Scripts de maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-[#002654]/20">
                      <h3 className="font-medium text-[#002654]">update-themes.js</h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Standardise les thèmes et vérifie la couverture
                      </p>
                      <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-[#002654] text-white hover:bg-[#001b3b] transition-colors">
                        Exécuter
                      </button>
                    </div>
                    <div className="p-4 rounded-xl border border-[#002654]/20">
                      <h3 className="font-medium text-[#002654]">insert-missing-positions.js</h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Ajoute les positions manquantes
                      </p>
                      <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-[#002654] text-white hover:bg-[#001b3b] transition-colors">
                        Exécuter
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#002654]">
                    Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button className="w-full p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors text-left">
                      <h3 className="font-medium text-[#002654]">Vérifier la cohérence</h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Analyse la cohérence des données
                      </p>
                    </button>
                    <button className="w-full p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors text-left">
                      <h3 className="font-medium text-[#002654]">Nettoyer la base</h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Supprime les données obsolètes
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 