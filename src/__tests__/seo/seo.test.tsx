import { render } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import Home from '@/app/page';
import Themes from '@/app/themes/page';
import Theme from '@/app/themes/[theme]/page';

describe('SEO Tests', () => {
  it('should have proper meta tags on home page', () => {
    const { container } = render(<Home />);
    const title = container.querySelector('title');
    const metaDescription = container.querySelector('meta[name="description"]');
    const h1 = container.querySelector('h1');
    
    expect(title).toBeTruthy();
    expect(metaDescription).toBeTruthy();
    expect(h1).toBeTruthy();
  });

  it('should have proper meta tags on themes page', () => {
    const { container } = render(<Themes />);
    const title = container.querySelector('title');
    const metaDescription = container.querySelector('meta[name="description"]');
    const h1 = container.querySelector('h1');
    
    expect(title).toBeTruthy();
    expect(metaDescription).toBeTruthy();
    expect(h1).toBeTruthy();
  });

  it('should have proper meta tags on theme detail page', () => {
    const { container } = render(<Theme params={{ theme: 'test-theme' }} />);
    const title = container.querySelector('title');
    const metaDescription = container.querySelector('meta[name="description"]');
    const h1 = container.querySelector('h1');
    
    expect(title).toBeTruthy();
    expect(metaDescription).toBeTruthy();
    expect(h1).toBeTruthy();
  });
}); 