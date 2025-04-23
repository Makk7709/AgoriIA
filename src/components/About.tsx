import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function About() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-[#002654]">
          À propos d'AgorIA
        </h2>
        <p className="text-xl text-[#002654]/90 font-serif">
          Un assistant citoyen propulsé par l'intelligence artificielle, conçu pour permettre à chacun de mieux comprendre les positions politiques, comparer les programmes électoraux et prendre des décisions éclairées.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-2 border-[#002654]/20">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-[#002654]">
              🎯 Notre mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#002654]/90">
              AgorIA est né d'un constat simple : l'information politique est souvent <strong>trop complexe, trop dispersée, ou trop orientée</strong>.
            </p>
            <p className="text-[#002654]/90">
              Notre ambition est de <strong>redonner du pouvoir aux citoyens</strong>, en leur offrant un accès simplifié, transparent et neutre aux données politiques majeures :
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#002654]/90">
              <li>Programmes électoraux</li>
              <li>Positions thématiques des candidats</li>
              <li>Engagements tenus ou non réalisés</li>
              <li>Alignement entre les idées des électeurs et des politiques</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#002654]/20">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-[#002654]">
              ⚙️ Comment ça fonctionne ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#002654]/90">
              AgorIA analyse les programmes politiques à l'aide d'algorithmes de NLP (traitement du langage naturel), puis :
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#002654]/90">
              <li>Classe les promesses par <strong>thème</strong> (économie, écologie, éducation, etc.)</li>
              <li>Résume et reformule les propositions pour les rendre <strong>plus lisibles</strong></li>
              <li>Identifie les écarts entre les discours et les actes (<strong>promesses non tenues</strong>)</li>
              <li>Propose un <strong>assistant conversationnel neutre</strong> qui répond à vos questions politiques</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#002654]/20">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-[#002654]">
              💡 Une IA engagée… mais pas engagée politiquement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#002654]/90">
              AgorIA n'est affilié à aucun parti, mouvement ou idéologie.
            </p>
            <p className="text-[#002654]/90">
              Notre seule fidélité va à la <strong>transparence démocratique</strong>, à l'<strong>accès à l'information</strong> et à l'<strong>intelligence collective</strong>.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#002654]/20">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-[#002654]">
              🤝 Une initiative pour tous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#002654]/90">
              Que vous soyez un <strong>citoyen curieux</strong>, un <strong>étudiant en sciences politiques</strong>, un <strong>journaliste</strong>, un <strong>enseignant</strong> ou simplement <strong>un électeur exigeant</strong>, AgorIA est fait pour vous.
            </p>
            <p className="text-xl font-serif text-[#002654] font-bold">
              Reprenons ensemble le pouvoir de comprendre.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 