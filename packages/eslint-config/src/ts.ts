import tsPlugin from '@typescript-eslint/eslint-plugin';
import type { ESLint, Linter } from 'eslint';
import ts from 'typescript-eslint';
import JS from './js.js';
import mapConfigsToRules from './map-configs-to-rules.js';
import { TYPESCRIPT_LANGUAGE_OPTIONS } from './typescript-language-options.js';

export default {
  ...JS,
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['**/*.d.ts', '**/*.test.ts'],
  languageOptions: TYPESCRIPT_LANGUAGE_OPTIONS,
  name: '@quisido/ts',

  plugins: {
    ...JS.plugins,
    '@typescript-eslint': tsPlugin as unknown as ESLint.Plugin,
  },

  rules: {
    ...(JS.rules as Linter.RulesRecord),
    ...(ts.configs.base.rules as Linter.RulesRecord),
    ...(ts.configs.eslintRecommended.rules as Linter.RulesRecord),
    ...mapConfigsToRules(ts.configs.stylisticTypeChecked as Linter.Config[]),
    ...mapConfigsToRules(ts.configs.recommendedTypeChecked as Linter.Config[]),
    ...mapConfigsToRules(ts.configs.strictTypeChecked as Linter.Config[]),
    'no-invalid-this': 'off',

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allow: [{ from: 'lib', name: ['URLSearchParams'] }],
        allowNumber: true,
      },
    ],

    // Exhaustive `switch`es do not require a default case.
    'default-case': 'off',

    /**
     *   ESLint incorrectly flags shadowing in TypeScript: (1) `enum`s and (2)
     * functions with `this` inside other functions with `this`.
     */
    'no-shadow': 'off',

    // https://eslint.org/docs/latest/rules/no-undef#handled_by_typescript
    'no-undef': 'off',

    // Required for `@typescript-eslint/no-floating-promises`.
    'no-void': ['error', { allowAsStatement: true }],
  } satisfies Linter.RulesRecord,
} satisfies Required<Omit<Linter.Config, 'language' | 'processor'>>;
