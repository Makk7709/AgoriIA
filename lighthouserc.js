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