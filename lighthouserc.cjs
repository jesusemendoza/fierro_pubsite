module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      url: [
        'http://localhost/index.html',
        'http://localhost/pricing/index.html',
        'http://localhost/why-fierro/index.html',
        'http://localhost/privacy/index.html',
        'http://localhost/terms/index.html',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'interactive': ['error', { maxNumericValue: 1500 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
