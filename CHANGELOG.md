# Changelog

## [Non publié]

### Ajouté
- Configuration complète de Lighthouse CI pour l'audit automatisé
- Composant `StructuredData` pour la gestion des données structurées JSON-LD
- Composant `BackForwardCache` pour l'optimisation du cache navigateur
- Métadonnées spécifiques pour chaque page (OpenGraph, Twitter Cards)
- Fichier `robots.txt` pour l'optimisation SEO
- Tests d'audit automatisés pour :
  - Performance
  - Accessibilité
  - SEO
  - Bonnes pratiques

### Modifié
- Amélioration des métadonnées dans le layout principal
- Optimisation des données structurées pour chaque page
- Configuration des assertions Lighthouse pour une meilleure évaluation
- Gestion du cache back/forward pour améliorer les performances

### Configuration Lighthouse
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run dev',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/themes',
        'http://localhost:3000/compare'
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['error', {maxNumericValue: 300}],
        'interactive': ['error', {maxNumericValue: 3500}],
        'speed-index': ['error', {maxNumericValue: 2000}],
        'performance-budget': ['error', {maxNumericValue: 3000}],
        'uses-text-compression': ['error', {minScore: 1}],
        'uses-responsive-images': ['error', {minScore: 1}],
        'uses-rel-preconnect': ['error', {minScore: 1}],
        'document-title': ['error', {minScore: 1}],
        'html-has-lang': ['error', {minScore: 1}],
        'meta-description': ['error', {minScore: 1}],
        'font-size': ['error', {minScore: 1}],
        'tap-targets': ['error', {minScore: 1}],
        'plugins': ['error', {minScore: 1}],
        'robots-txt': ['error', {minScore: 1}],
        'is-crawlable': ['error', {minScore: 1}],
        'canonical': ['error', {minScore: 1}],
        'hreflang': ['error', {minScore: 1}],
        'structured-data': ['warn', {minScore: 0.8}],
        'bf-cache': ['warn', {minScore: 0.8}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Résultats des tests
Les tests Lighthouse ont été exécutés sur les pages suivantes :
1. Page d'accueil (http://localhost:3000)
2. Page des thèmes (http://localhost:3000/themes)
3. Page de comparaison (http://localhost:3000/compare)

Résultats disponibles aux URLs :
- Page d'accueil : https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1745356375392-93054.report.html
- Page des thèmes : https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1745356381665-43166.report.html
- Page de comparaison : https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1745356387171-86635.report.html

### Améliorations à venir
1. Optimisation des données structurées pour une meilleure validation
2. Amélioration de la gestion du cache back/forward
3. Ajout de tests d'accessibilité supplémentaires
4. Optimisation des performances de chargement des pages
5. Mise en place d'un système de monitoring continu des performances

### Dépendances ajoutées
```json
{
  "devDependencies": {
    "@lhci/cli": "^0.12.0",
    "lighthouse": "^10.1.0"
  }
}
```

### Scripts npm ajoutés
```json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "test:lighthouse": "lhci autorun --config=./lighthouserc.js"
  }
}
``` 