import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: 'Gestion des Thèmes - Agoria',
  description: 'Interface de gestion des thèmes'
}

export default async function ThemesManagement() {
  // Récupérer les thèmes et les positions associées
  const { data: themes } = await supabase
    .from('themes')
    .select('*')
    .order('name')

  const { data: positions } = await supabase
    .from('positions')
    .select('theme_id')

  // Calculer les statistiques
  const positionsCount = positions?.reduce((acc, pos) => {
    acc[pos.theme_id] = (acc[pos.theme_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#002654]">
              Gestion des Thèmes
            </h1>
            <p className="mt-2 text-[#002654]/60">
              Gérez les thèmes et leurs positions associées
            </p>
          </div>
          <Link
            href="/admin/themes/new"
            className="px-6 py-3 rounded-xl bg-[#002654] text-white hover:bg-[#001b3b] transition-colors"
          >
            Nouveau thème
          </Link>
        </div>

        {/* Onglets de gestion */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full justify-start bg-white border-b border-[#002654]/10">
            <TabsTrigger value="list" className="text-lg font-serif">
              Liste des thèmes
            </TabsTrigger>
            <TabsTrigger value="organize" className="text-lg font-serif">
              Organisation
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-lg font-serif">
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes?.map((theme) => (
                <Card key={theme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-serif text-[#002654]">
                          {theme.name}
                        </CardTitle>
                        <CardDescription>{theme.description}</CardDescription>
                      </div>
                      <Link
                        href={`/admin/themes/${theme.id}`}
                        className="px-4 py-2 rounded-lg bg-[#002654]/10 text-[#002654] hover:bg-[#002654]/20 transition-colors"
                      >
                        Éditer
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#002654]/60">Positions associées</span>
                        <span className="font-medium text-[#002654]">
                          {positionsCount[theme.id] || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#002654]/60">Dernière mise à jour</span>
                        <span className="font-medium text-[#002654]">
                          {new Date(theme.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organize" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#002654]">
                  Organisation des thèmes
                </CardTitle>
                <CardDescription>
                  Réorganisez et regroupez les thèmes pour une meilleure navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {themes?.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#002654]" />
                        <div>
                          <h3 className="font-medium text-[#002654]">{theme.name}</h3>
                          <p className="text-sm text-[#002654]/60">{theme.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-[#002654]/10 transition-colors">
                          <svg className="w-5 h-5 text-[#002654]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[#002654]/10 transition-colors">
                          <svg className="w-5 h-5 text-[#002654]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#002654]">
                    Répartition des positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {themes?.map((theme) => (
                      <div key={theme.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#002654]">{theme.name}</span>
                          <span className="text-sm text-[#002654]/60">
                            {positionsCount[theme.id] || 0} positions
                          </span>
                        </div>
                        <div className="w-full bg-[#002654]/10 rounded-full h-2">
                          <div
                            className="bg-[#002654] h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((positionsCount[theme.id] || 0) / 20) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
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
                    <button className="w-full p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors text-left group">
                      <h3 className="font-medium text-[#002654] group-hover:text-[#001b3b]">
                        Fusionner des thèmes
                      </h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Combinez des thèmes similaires
                      </p>
                    </button>
                    <button className="w-full p-4 rounded-xl border border-[#002654]/20 hover:border-[#002654] transition-colors text-left group">
                      <h3 className="font-medium text-[#002654] group-hover:text-[#001b3b]">
                        Standardiser les descriptions
                      </h3>
                      <p className="text-sm text-[#002654]/60 mt-1">
                        Uniformisez le format des descriptions
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