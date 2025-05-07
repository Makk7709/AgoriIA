# AgorIA - Plateforme d'Information Politique

## À propos

AgorIA est une plateforme innovante conçue pour éclairer les citoyens sur les positions politiques des candidats aux élections françaises. Notre mission est de fournir une information claire, objective et accessible, permettant aux électeurs de prendre des décisions éclairées.

## Objectif

Notre objectif est simple : informer, pas convaincre. Nous croyons en la force d'une démocratie éclairée où chaque citoyen peut accéder facilement aux positions des candidats sur les sujets qui lui importent.

## Fonctionnalités

- **Exploration par Thèmes** : Accédez aux positions des candidats organisées par thèmes politiques majeurs :
  - Écologie
  - Économie
  - Éducation
  - Emploi
  - Europe
  - Institutions
  - Santé
  - Sécurité
  - Social

- **Comparaison Transparente** : Comparez facilement les positions des différents candidats sur chaque thème.

- **Sources Vérifiées** : Chaque position est accompagnée de sa source, permettant aux utilisateurs de vérifier l'information.

- **Interface Intuitive** : Une expérience utilisateur fluide et accessible, conçue pour faciliter la navigation et la compréhension.

- **Recherche Sémantique** : Utilisez notre moteur de recherche avancé pour trouver des positions politiques similaires ou connexes.

## Statut du Projet

⚠️ **Version Bêta** : AgorIA est actuellement en phase de test. Bien que nous nous efforcions de fournir des informations précises, certaines erreurs peuvent survenir. Nous encourageons les utilisateurs à vérifier les informations auprès des sources officielles.

## Indépendance

AgorIA est développée et distribuée par Korev AI. Nous ne sommes affiliés à aucun groupe de pensée ou parti politique. Notre engagement est envers la transparence et l'objectivité de l'information.

## Installation

```bash
# Cloner le repository
git clone https://github.com/Makk7709/AgoriIA.git

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

## Configuration Requise

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# Pinecone
PINECONE_API_KEY=votre_clé_api_pinecone
PINECONE_ENVIRONMENT=votre_environnement_pinecone

# OpenAI
OPENAI_API_KEY=votre_clé_api_openai

# Redis (optionnel)
REDIS_URL=votre_url_redis
```

## Configuration de Pinecone

### Prérequis

1. Créez un compte sur [Pinecone](https://www.pinecone.io/)
2. Créez un index dans votre projet Pinecone
3. Notez votre API key et l'environnement (environment)

### Configuration

1. Ajoutez les variables d'environnement Pinecone dans votre fichier `.env.local`
2. L'index Pinecone sera automatiquement initialisé au démarrage de l'application

### Utilisation

Pinecone est utilisé pour stocker et rechercher des embeddings vectoriels des documents politiques. Cela permet :

- Une recherche sémantique efficace des positions politiques
- Une meilleure compréhension du contexte des documents
- Une classification automatique des thèmes

## Technologies Utilisées

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Headless UI

### Backend & Base de données

- Supabase
- Pinecone (Base de données vectorielle)
- Redis
- OpenAI

### Outils de développement

- Vitest (Tests unitaires)
- Playwright (Tests E2E)
- Lighthouse (Audit de performance)
- ESLint
- Prettier

## Tests

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests E2E
npm run test:e2e

# Vérifier l'accessibilité
npm run test:a11y

# Vérifier les performances
npm run audit:lighthouse
```

## Contribution

Nous accueillons les retours et suggestions de la communauté pour améliorer continuellement notre plateforme. N'hésitez pas à nous contacter pour signaler des erreurs ou proposer des améliorations.

Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est protégé par le droit d'auteur. Tous droits réservés © 2024 Korev AI. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter à [contact@korev.ai](mailto:contact@korev.ai).

## Remerciements

Nous tenons à remercier :

- La communauté open source pour les outils et bibliothèques qui ont rendu ce projet possible
- Les développeurs et contributeurs qui ont partagé leur expertise
- Les utilisateurs bêta pour leurs retours précieux
- Notre équipe pour leur dévouement et leur engagement envers la transparence politique
- Lena Gaubert pour son idée à la base de ce projet

---

> AgorIA - Informer pour une démocratie éclairée
