import { render } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import { ThemeHeader } from '@/components/themes/ThemeHeader';
import { ComparisonGrid } from '@/components/themes/ComparisonGrid';
import { MatchResults } from '@/components/themes/MatchResults';
import { Scale } from 'lucide-react';
import Home from '../app/page';
import Themes from '../app/themes/page';
import Theme from '../app/themes/[theme]/page';
import axeCore from 'axe-core';

declare global {
  namespace Vi {
    interface Assertion {
      toHaveNoViolations(): Promise<void>;
    }
  }
}

describe('Accessibility Tests', () => {
  it('Home page should have no accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });

  it('Themes page should have no accessibility violations', async () => {
    const { container } = render(<Themes />);
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });

  it('Theme page should have no accessibility violations', async () => {
    const { container } = render(<Theme params={{ theme: 'test-theme' }} />);
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });

  it('ThemeHeader should have no accessibility violations', async () => {
    const { container } = render(
      <ThemeHeader
        title="Test Theme"
        description="Test Description"
        icon={Scale}
        themeId="test-theme"
        totalThemes={5}
        currentThemeIndex={0}
      />
    );
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });

  it('ComparisonGrid should have no accessibility violations', async () => {
    const mockPositions = [{
      id: 'test-position',
      title: 'Test Position',
      description: 'Test Description',
      candidates: [{
        id: 'test-candidate',
        name: 'Test Candidate',
        position: 'agree' as const,
        explanation: 'Test explanation'
      }]
    }];

    const { container } = render(
      <ComparisonGrid
        positions={mockPositions}
      />
    );
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });

  it('MatchResults should have no accessibility violations', async () => {
    const mockCandidates = [{
      id: 'test-candidate',
      name: 'Test Candidate',
      score: 80,
      matchCount: 4,
      totalQuestions: 5
    }];

    const { container } = render(
      <MatchResults
        candidates={mockCandidates}
      />
    );
    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
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

    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
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

    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
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

    const results = await axeCore.run(container);
    expect(results.violations).toEqual([]);
  });
}); 