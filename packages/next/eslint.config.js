import configs, { disableRulesForFiles } from '@quisido/eslint-config';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {readonly import('eslint').Linter.Config[]} */
export default [
  ...configs,

  // NodeJS
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },

  // Plugins: react-compiler, react-hooks, react-refresh
  {
    plugins: {
      'react-compiler': reactCompiler,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      'react-compiler/react-compiler': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': 'error',
    },
  },

  ...disableRulesForFiles({
    '@typescript-eslint/no-non-null-assertion': ['src/utils/split.ts'],
    'func-style': ['src/**/*.tsx'],
    'max-params': ['src/utils/assert.ts'],
    'prefer-named-capture-group': ['src/test/cypress/utils/select.ts'],
    'prefer-rest-params': ['src/modules/react-google-analytics/**/*.ts'],
    'react-compiler/react-compiler': ['src/test/utils/render-hook-error.tsx'],
    'react-refresh/only-export-components': ['src/app/**/page.tsx'],

    '@typescript-eslint/no-deprecated': [
      'src/utils/map-navigator-to-semantic-resource-attributes.ts',
    ],

    '@typescript-eslint/no-explicit-any': [
      'src/modules/react-google-charts/chart.ts',
    ],

    '@typescript-eslint/no-unused-vars': [
      'src/modules/react-google-analytics/**/*.ts',
    ],

    camelcase: [
      'src/features/header-authenticate-link.tsx',
      'src/hooks/use-effect-event.ts',
      'src/hooks/use-emit/constants/sentry-event.ts',
      'src/hooks/use-emit/utils/create-sentry-event.ts',
      'src/modules/react-google-analytics/**/*.ts',
    ],

    complexity: [
      'src/utils/is-dashboard-api-response.ts',
      'src/utils/map-authn-error-code-to-notification.tsx',
      'src/utils/map-oscpu-to-name.ts',
    ],

    'id-length': [
      'src/modules/react-clarity/clarity-api.ts',
      'src/modules/react-intercom/utils/create-intercom.ts',
    ],

    'no-magic-numbers': [
      'src/constants/*.ts',
      'src/modules/quisi/heading-level.ts',
      'src/modules/react-google-charts/chart-options.ts',
      'src/types/log-rocket.ts',
      'src/types/sentry-fullstory-client.ts',
    ],

    'no-undefined': [
      'src/hooks/use-emit/use-emit.ts',
      'src/hooks/use-google-analytics.ts',
      'src/modules/use-async-state/hooks/use-async-state.ts',
      'src/modules/use-async-state/hooks/use-get-state.ts',
    ],

    'no-useless-return': [
      'src/utils/map-navigator-to-semantic-resource-attributes.ts',
    ],
  }),

  // Technical debt: Refactor large files after launching.
  {
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
    },
  },
];
