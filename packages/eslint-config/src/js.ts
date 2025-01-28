import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import { LANGUAGE_OPTIONS } from './language-options.js';
import { LINTER_OPTIONS } from './linter-options.js';

export default {
  files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
  languageOptions: LANGUAGE_OPTIONS,
  linterOptions: LINTER_OPTIONS,
  name: '@quisido/js',
  settings: {},

  plugins: {
    prettier: prettierPlugin,
  },

  rules: {
    ...js.configs.all.rules,
    ...js.configs.recommended.rules,
    ...prettierConfig.rules,
    ...prettierPluginRecommended.rules,
    camelcase: ['error', { properties: 'never' }],
    'func-name-matching': 'off',
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'one-var': 'off',
    'sort-imports': 'off',
    'sort-keys': ['error', 'asc', { allowLineSeparatedGroups: true }],

    // Too many false positives.
    'consistent-return': 'off',
  },
} satisfies Required<Omit<Linter.Config, 'ignores' | 'language' | 'processor'>>;
