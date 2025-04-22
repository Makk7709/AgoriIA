# Tests et Audits

Ce document décrit les différents types de tests et audits mis en place pour le projet AgorIA.

## Tests Lighthouse

Lighthouse est utilisé pour auditer automatiquement les performances, l'accessibilité, le SEO et les bonnes pratiques de l'application.

### Installation

```bash
npm install --save-dev @lhci/cli lighthouse
```

### Configuration

Le fichier `lighthouserc.js` à la racine du projet contient la configuration des tests Lighthouse. Il définit :
- Les URLs à tester
- Les paramètres de test
- Les seuils d'assertion
- Les options de collecte et d'upload

### Exécution des tests

```bash
# Exécuter tous les tests
npm run test:lighthouse

# Exécuter les tests sur une URL spécifique
npx lhci autorun --url=http://localhost:3000
```

### Résultats

Les résultats des tests sont automatiquement uploadés et disponibles via les URLs fournies dans le CHANGELOG.md.

## Composants de test

### StructuredData

Le composant `StructuredData` gère les données structurées JSON-LD pour le SEO. Il est utilisé dans :
- Le layout principal
- La page d'accueil
- La page des thèmes
- La page de comparaison

### BackForwardCache

Le composant `BackForwardCache` optimise la gestion du cache navigateur. Il est utilisé dans le layout principal.

## Métadonnées

Chaque page inclut des métadonnées spécifiques pour :
- SEO
- Partage social (OpenGraph, Twitter Cards)
- Accessibilité

## Améliorations continues

Les tests sont configurés pour s'exécuter automatiquement et fournir des rapports détaillés. Les améliorations sont documentées dans le CHANGELOG.md.

## Bonnes pratiques

1. Exécuter les tests avant chaque déploiement
2. Vérifier les rapports Lighthouse pour identifier les problèmes
3. Maintenir les seuils d'assertion à jour
4. Documenter les modifications dans le CHANGELOG.md

## Ressources

- [Documentation Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Documentation Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Schema.org](https://schema.org/)
- [OpenGraph Protocol](https://ogp.me/) 