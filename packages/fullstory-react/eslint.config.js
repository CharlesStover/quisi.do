import configs, { disableRulesForFiles } from '@quisido/eslint-config';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {readonly import('eslint').Linter.Config[]} */
export default [
  ...configs,

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
    'max-lines-per-function': ['src/utils/map-v2-operation-handlers-to-api.ts'],
    'new-cap': ['src/utils/map-v2-operation-handlers-to-api.ts'],
    'no-console': ['src/test/expect-to-throw.tsx'],

    '@typescript-eslint/consistent-type-assertions': [
      'src/utils/capitalize.ts',
      'src/utils/map-v2-operation-handlers-to-api.ts',
    ],

    'func-style': [
      'src/**/*.tsx',
      'src/utils/map-v2-operation-handlers-to-api.ts',
    ],
  }),
];
