# 🗳️ AgorIA

Application civic-tech développée par Korev AI qui utilise l'intelligence artificielle pour aider les citoyens à comparer les positions des candidats politiques sur différents thèmes.

## ⚠️ Propriété intellectuelle

Ce logiciel est la propriété exclusive de Korev AI SAS. Tous droits réservés.
- Code source protégé et confidentiel
- Utilisation soumise à autorisation
- Voir le fichier `LICENSE` pour les conditions détaillées

## 🎯 Fonctionnalités

- **Comparaison des positions** : Visualisez et comparez les positions des candidats sur différents thèmes
- **Analyse IA** : Obtenez une analyse objective des convergences et divergences entre les candidats
- **Matching citoyen** : Découvrez avec quels candidats vos opinions s'alignent le plus
- **Sauvegarde des réponses** : Conservez vos réponses pour suivre l'évolution de vos alignements

## 🛠️ Technologies

- **Frontend** : Next.js 14 avec App Router
- **UI/UX** : Tailwind CSS + shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **IA** : OpenAI GPT-4
- **Authentification** : Supabase Auth (à venir)

## 📦 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
├── components/            
│   ├── AIAnalysis/        # Analyse IA des positions
│   ├── ComparisonGrid/    # Grille de comparaison
│   ├── Scoreboard/        # Tableau des scores d'alignement
│   └── ui/                # Composants UI réutilisables
├── lib/
│   ├── openai/            # Configuration et fonctions OpenAI
│   ├── supabase/          # Configuration et fonctions Supabase
│   ├── positions.ts       # Logique de sélection des positions
│   ├── scoring.ts         # Calcul des scores d'alignement
│   └── utils.ts           # Utilitaires
```

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/Makk7709/AgoriIA.git
cd AgoriIA
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env.local
```
Puis remplissez les variables dans `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé
OPENAI_API_KEY=votre_clé
```

4. Créez la table Supabase :
```sql
create table user_responses (
  id uuid primary key,
  theme_id text not null,
  user_id uuid not null,
  responses jsonb not null,
  alignment_scores jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

## 📝 Documentation technique

### Matching citoyen

Le système de matching compare les réponses de l'utilisateur avec les positions des candidats :

- **Sélection des positions** : 3 positions représentatives sont choisies pour le questionnaire
- **Calcul des scores** :
  - D'accord ↔ D'accord = +1
  - Pas d'accord ↔ Pas d'accord = +1
  - Neutre = 0
  - Sinon = -1
- **Sauvegarde** : Les réponses et scores sont stockés dans Supabase (table `user_responses`)

### Analyse IA

L'analyse utilise GPT-4 pour :
- Résumer objectivement les positions
- Identifier les points de convergence
- Repérer les divergences majeures
- Fournir un score de confiance

## 📄 Licence et Contact

© 2025 Korev AI SAS. Tous droits réservés.

Pour toute demande d'accès, d'utilisation ou de partenariat :
- Email : [email]
- Site web : [site]

## 🙏 Technologies tierces

Ce projet utilise les technologies suivantes sous leurs licences respectives :
- [shadcn/ui](https://ui.shadcn.com/) - MIT License
- [Supabase](https://supabase.com/) - Apache 2.0
- [OpenAI](https://openai.com/) - Usage commercial sous contrat

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Tests et Qualité

Le projet inclut plusieurs niveaux de tests et d'audits :

### Tests automatisés
```bash
# Tests unitaires et d'intégration
npm run test

# Tests d'accessibilité
npm run test:a11y

# Tests end-to-end
npm run test:e2e
```

### Audit Lighthouse
```bash
# Audit complet
npm run audit:lighthouse

# Audit avec configuration personnalisée
npm run test:lighthouse
```

### Vérification de la qualité
```bash
# Linting
npm run lint

# Vérification des types
npm run type-check
```

## Structure du projet

```
agoria/
├── src/
│   ├── app/              # Pages et routes Next.js
│   ├── components/       # Composants React réutilisables
│   ├── lib/             # Utilitaires et configurations
│   ├── tests/           # Tests unitaires et d'intégration
│   └── types/           # Types TypeScript
├── public/              # Assets statiques
├── docs/               # Documentation
└── scripts/            # Scripts utilitaires
```

## Documentation

- [Guide de contribution](CONTRIBUTING.md)
- [Documentation des tests](docs/TESTING.md)
- [Changelog](CHANGELOG.md)

## Améliorations récentes

- ✅ Configuration complète de Lighthouse CI
- ✅ Ajout de données structurées JSON-LD
- ✅ Optimisation du cache navigateur
- ✅ Amélioration des métadonnées SEO
- ✅ Tests d'accessibilité automatisés

## Prochaines étapes

- [ ] Optimisation des performances
- [ ] Amélioration de l'accessibilité
- [ ] Ajout de nouvelles fonctionnalités d'analyse
- [ ] Intégration de tests end-to-end
- [ ] Mise en place du monitoring

## Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md) pour plus de détails.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à [ouvrir une issue](https://github.com/Makk7709/AgoriIA/issues).
