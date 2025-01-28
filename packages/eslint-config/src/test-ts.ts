import type { Linter } from 'eslint';
import TS from './ts.js';

export default {
  ...TS,
  files: ['**/*.test.ts', '**/*.test.tsx'],
  ignores: [],
  name: '@quisido/test-ts',

  rules: {
    ...TS.rules,
    'max-lines-per-function': 'off',
    'no-undefined': 'off',

    /**
     *   This rule is incompatible with TypeScript when setting a variable in a
     * callback.
     *
     * let x: (() => void) | undefined = undefined;
     * (function(): void {
     *   x = () => {};
     * }).apply(null);
     * assert(typeof x !== 'undefined');
     * x(); // Type 'never' has no call signatures. ts(2349)
     */
    'init-declarations': 'off',
  } satisfies Linter.RulesRecord,
} satisfies Required<Omit<Linter.Config, 'language' | 'processor'>>;
