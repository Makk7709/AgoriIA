# AgorIA - Plateforme d'Analyse Politique

## Description

AgorIA est une plateforme d'analyse politique qui permet de comparer les positions des candidats sur différents thèmes. La plateforme utilise l'intelligence artificielle pour analyser et présenter les informations de manière claire et accessible.

## Version MVP 1.1

La version MVP 1.1 apporte les améliorations suivantes :
- 🚀 Interface utilisateur optimisée et responsive
- 🔍 Système de recherche vectorielle amélioré
- 🎯 Suggestions de questions contextuelles
- 🔒 Système d'authentification robuste
- 📱 Support PWA (Progressive Web App)
- 🧪 Tests unitaires et d'intégration
- 🛠️ Optimisation des performances

## Fonctionnalités Principales

- 🔍 Analyse des positions politiques
- 📊 Comparaison des candidats
- 🎯 Thèmes variés (Écologie, Économie, Éducation, etc.)
- 🔒 Système de rôles (Admin/User)
- 📱 Interface responsive
- 🧠 Recherche vectorielle avancée avec Pinecone

## Architecture Technique

### Stack Technologique

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: API Routes Next.js
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Validation**: Zod
- **Tests**: Vitest, Testing Library
- **Recherche Vectorielle**: Pinecone
- **PWA**: Service Workers, Manifest

### Fonctionnalités Avancées

#### Recherche Vectorielle avec Pinecone

La plateforme intègre une recherche vectorielle puissante basée sur Pinecone, permettant :
- Indexation sémantique des positions politiques
- Recherche contextuelle et sémantique
- Amélioration de la pertinence des résultats
- Optimisation des performances de recherche

### Sécurité

- RBAC (Role-Based Access Control)
- Validation des données avec Zod
- Protection des routes sensibles
- RLS (Row Level Security) dans Supabase

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/agoria.git
cd agoria
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile le projet
- `npm run start` : Lance le serveur de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run test` : Lance les tests
- `npm run type-check` : Vérifie les types TypeScript
- `npm run security:check` : Vérifie les vulnérabilités
- `npm run security:fix` : Corrige les vulnérabilités
- `npm run lighthouse` : Analyse les performances

## Structure du Projet

```
agoria/
├── src/
│   ├── app/              # Routes et pages Next.js
│   ├── components/       # Composants React
│   ├── lib/             # Utilitaires et configurations
│   ├── hooks/           # Hooks personnalisés
│   ├── types/           # Types TypeScript
│   └── test/            # Tests
├── public/              # Assets statiques
├── archives/            # Documentation et rapports
└── scripts/             # Scripts utilitaires
```

## Documentation

- [Rapport de Sécurité](archives/security_check_agoria.md)
- [Rapport UX](archives/ux_check_agoria.md)
- [Guide d'Installation](docs/installation.md)
- [Guide de Contribution](docs/contributing.md)

## Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](docs/contributing.md) pour plus de détails.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---
*Développé avec ❤️ par l'équipe AgorIA - Version MVP 1.1*
