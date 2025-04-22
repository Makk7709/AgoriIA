# Guide de contribution

Merci de votre intérêt pour contribuer à AgorIA ! Ce document fournit les directives pour contribuer au projet.

## Comment contribuer

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: add some amazing feature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Standards de code

### Style de code

- Utilisez Prettier pour le formatage
- Suivez les règles ESLint
- Utilisez TypeScript pour le typage

### Commits

Suivez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types de commits :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Tests

- Écrivez des tests pour les nouvelles fonctionnalités
- Assurez-vous que tous les tests passent
- Maintenez la couverture de tests

### Pull Requests

1. Mettez à jour le README.md si nécessaire
2. Ajoutez des tests pour les nouvelles fonctionnalités
3. Assurez-vous que les tests passent
4. Mettez à jour la documentation

## Processus de développement

1. **Planification**
   - Créez une issue pour décrire la fonctionnalité
   - Définissez les critères d'acceptation
   - Assignez-vous l'issue

2. **Développement**
   - Créez une branche à partir de `main`
   - Développez la fonctionnalité
   - Écrivez les tests
   - Documentez les changements

3. **Review**
   - Assurez-vous que les tests passent
   - Vérifiez la couverture de tests
   - Exécutez l'audit Lighthouse
   - Demandez une review

4. **Merge**
   - Résolvez les conflits
   - Mettez à jour la documentation
   - Merge dans `main`

## Tests et qualité

### Tests unitaires
```bash
npm run test
```

### Tests d'accessibilité
```bash
npm run test:a11y
```

### Audit Lighthouse
```bash
npm run audit:lighthouse
```

### Linting
```bash
npm run lint
```

## Documentation

- Mettez à jour la documentation si nécessaire
- Ajoutez des commentaires pour le code complexe
- Documentez les nouvelles fonctionnalités

## Questions ?

Si vous avez des questions, n'hésitez pas à :
- Ouvrir une issue
- Contacter les mainteneurs
- Consulter la documentation 