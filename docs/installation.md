# Guide d'Installation d'AgorIA

Ce guide vous aidera à installer et configurer AgorIA sur votre machine locale.

## Prérequis

- Node.js 18.x ou supérieur
- npm 9.x ou supérieur
- Git
- Un compte Supabase
- Une clé API OpenAI

## Étapes d'Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/agoria.git
cd agoria
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configuration de l'Environnement

1. Copier le fichier d'exemple :
```bash
cp .env.example .env.local
```

2. Configurer les variables d'environnement dans `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_supabase

# OpenAI
OPENAI_API_KEY=votre_clé_api_openai

# Autres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialisation de la Base de Données

1. Créer les tables nécessaires :
```bash
npm run create:profiles
```

2. Créer un utilisateur administrateur :
```bash
npm run create:admin
```

### 5. Vérification de l'Installation

1. Lancer le serveur de développement :
```bash
npm run dev
```

2. Vérifier que tout fonctionne :
```bash
npm run type-check
npm run test
npm run security:check
```

## Dépannage

### Problèmes Courants

1. **Erreur de connexion à Supabase**
   - Vérifier les variables d'environnement
   - S'assurer que le projet Supabase est actif

2. **Erreurs TypeScript**
   - Exécuter `npm run type-check` pour identifier les problèmes
   - Vérifier les imports et les types

3. **Problèmes de Build**
   - Nettoyer le cache : `npm run clean`
   - Réinstaller les dépendances : `rm -rf node_modules && npm install`

## Mise à Jour

Pour mettre à jour AgorIA :

1. Récupérer les derniers changements :
```bash
git pull origin main
```

2. Mettre à jour les dépendances :
```bash
npm install
```

3. Vérifier la compatibilité :
```bash
npm run type-check
npm run test
```

## Support

Si vous rencontrez des problèmes :
1. Consulter la [documentation](https://github.com/votre-username/agoria/docs)
2. Ouvrir une issue sur GitHub
3. Contacter l'équipe de support

---
*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}* 