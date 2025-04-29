# Guide de Contribution à AgorIA

Merci de votre intérêt pour contribuer à AgorIA ! Ce guide vous aidera à comprendre comment participer au projet.

## Code de Conduite

Nous nous engageons à maintenir un environnement de développement respectueux et inclusif. Veuillez lire notre [Code de Conduite](CODE_OF_CONDUCT.md) avant de contribuer.

## Processus de Contribution

### 1. Préparation

1. Fork le repository
1. Cloner votre fork :

```bash
git clone https://github.com/votre-username/agoria.git
cd agoria

```bash


1. Ajouter le repository original comme upstream :

```bash
git remote add upstream https://github.com/original-username/agoria.git

```bash


### 2. Développement

1. Créer une nouvelle branche :

```bash
git checkout -b feature/nom-de-la-fonctionnalite

```bash


1. Installer les dépendances :

```bash
npm install

```bash


1. Développer votre fonctionnalité en suivant les standards de code :
   - Utiliser TypeScript
   - Suivre les conventions de nommage
   - Ajouter des tests
   - Documenter le code

### 3. Tests

Exécuter les tests avant de soumettre votre contribution :

```bash
npm run test
npm run type-check
npm run lint

```bash


### 4. Soumission

1. Commiter vos changements :

```bash
git add .
git commit -m "feat: description de la fonctionnalité"

```bash


1. Pousser vers votre fork :

```bash
git push origin feature/nom-de-la-fonctionnalite

```bash


1. Créer une Pull Request sur GitHub

## Standards de Code

### TypeScript

- Utiliser des types stricts

- Éviter `any`

- Documenter les interfaces et types complexes

### Tests

- Tests unitaires pour les fonctions

- Tests d'intégration pour les composants

- Tests d'accessibilité

- Tests de sécurité

### Documentation

- Commenter le code complexe

- Mettre à jour la documentation

- Ajouter des exemples d'utilisation

## Structure des Commits

Utiliser le format suivant :

```bash


type(scope): description

[body]

[footer]

```bash


Types :

- `feat`: Nouvelle fonctionnalité

- `fix`: Correction de bug

- `docs`: Documentation

- `style`: Formatage

- `refactor`: Refactoring

- `test`: Tests

- `chore`: Maintenance

## Review Process

1. Vérification automatique :
   - Tests
   - Linting
   - Type checking

1. Review manuelle :
   - Code review
   - Tests de la fonctionnalité
   - Vérification de la documentation

## Support

Si vous avez des questions :
1. Consulter la documentation
1. Ouvrir une issue
1. Contacter l'équipe

---

*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*
