module.exports = {
  env: {
    browser: true,
    amd: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    curly: ['error', 'all'],
    'comma-dangle': ['error', 'only-multiline'],
    'func-names': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'linebreak-style': ['error', 'windows'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-var': 'error',
    'max-len': ['error', { code: 120 }],
    'operator-linebreak': [2, 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'prefer-destructuring': 0,
    'prefer-object-spread': 0,
    'prefer-rest-params': 0,
    'prefer-template': 0,
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: 'src/site-a/',
            from: 'src/common/Link.js',
            message: 'Import the site-specific Link component instead.',
          },
        ],
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './js/bl/',
            from: './js/ui/',
          },
          {
            target: './js/ui/',
            from: './js/bl/',
            message: 'Import the site-specific Link component instead.',
          },
          {
            target: './js/dl/',
            from: './js/ui/',
            message: 'Import the site-specific Link component instead.',
          },
          {
            target: './js/bl/',
            from: './js/dl/',
            message: 'Import the site-specific Link component instead.',
          },
        ],
      },
    ],
    strict: [2, 'function'],
  },
  globals: {
    google: 'readonly',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
};
