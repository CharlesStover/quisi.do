import CONFIG, {
  COVERAGE_OPTIONS,
  INLINE_CONFIG,
  PLUGIN_OPTIONS,
} from '@quisido/vitest-config';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import type { CoverageOptions } from 'vitest/dist/node.js';

export default defineConfig({
  ...CONFIG,
  plugins: [...PLUGIN_OPTIONS, ...viteReact()],
  test: {
    ...INLINE_CONFIG,
    environment: 'jsdom',

    coverage: {
      ...COVERAGE_OPTIONS,

      thresholds: {
        branches: 4,
        functions: 6,
        lines: 7,
        statements: 7,
      },
    } as CoverageOptions,

    env: {
      CLARITY_TAG: 'test-clarity-tag',
    },
  },
});
