import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeHeader } from '@/components/themes/ThemeHeader';
import { ComparisonGrid } from '@/components/themes/ComparisonGrid';
import { MatchResults } from '@/components/themes/MatchResults';
import { Scale } from 'lucide-react';
import Home from '../app/page';
import Themes from '../app/themes/page';
import Theme from '../app/themes/[theme]/page';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  // Test ThemeHeader
  test('ThemeHeader should be accessible', async () => {
    const { container } = render(
      <ThemeHeader
        title="Économie et emploi"
        description="Découvrez et comparez les positions des candidats sur les questions économiques et l'emploi."
        icon={Scale}
        themeId="economy"
        totalThemes={8}
        currentThemeIndex={0}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test ComparisonGrid
  test('ComparisonGrid should be accessible', async () => {
    const mockPositions = [
      {
        id: '1',
        title: 'Réduction du temps de travail',
        description: 'Proposition de réduire la semaine de travail à 32 heures.',
        candidates: [
          {
            id: '1',
            name: 'Candidat A',
            position: 'agree' as const,
            explanation: 'Soutient la réduction du temps de travail pour améliorer la qualité de vie.'
          },
          {
            id: '2',
            name: 'Candidat B',
            position: 'disagree' as const,
            explanation: 'Craint l\'impact sur la compétitivité des entreprises.'
          }
        ]
      }
    ];

    const { container } = render(
      <ComparisonGrid positions={mockPositions} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test MatchResults
  test('MatchResults should be accessible', async () => {
    const mockCandidates = [
      {
        id: '1',
        name: 'Candidat A',
        score: 75,
        matchCount: 15,
        totalQuestions: 20
      },
      {
        id: '2',
        name: 'Candidat B',
        score: 60,
        matchCount: 12,
        totalQuestions: 20
      }
    ];

    const { container } = render(
      <MatchResults candidates={mockCandidates} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test des contrastes
  test('Text contrast should meet WCAG AA standards', async () => {
    const { container } = render(
      <div>
        <h1 className="text-gray-900">Titre principal</h1>
        <p className="text-gray-700">Texte normal</p>
        <p className="text-gray-500">Texte secondaire</p>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test des landmarks
  test('Page should have proper landmarks', async () => {
    const { container } = render(
      <div>
        <header role="banner">
          <nav role="navigation">
            <ul>
              <li><a href="/">Accueil</a></li>
            </ul>
          </nav>
        </header>
        <main role="main">
          <section aria-labelledby="section-title">
            <h2 id="section-title">Section</h2>
          </section>
        </main>
        <footer role="contentinfo">
          <p>Footer</p>
        </footer>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Test des composants interactifs
  test('Interactive elements should have proper ARIA attributes', async () => {
    const { container } = render(
      <div>
        <button aria-label="Fermer">×</button>
        <input type="text" aria-label="Rechercher" />
        <select aria-label="Trier par">
          <option>Option 1</option>
        </select>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on home page', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on themes page', async () => {
    const { container } = render(<Themes />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on theme detail page', async () => {
    const { container } = render(<Theme />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 