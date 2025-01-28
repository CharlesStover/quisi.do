import type { UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import { INLINE_CONFIG } from './inline-config.js';
import { PLUGIN_OPTIONS } from './plugin-options.js';
export { COVERAGE_OPTIONS } from './coverage-options.js';
export { EXCLUDE } from './exclude.js';
export { INLINE_CONFIG } from './inline-config.js';
export { PLUGIN_OPTIONS } from './plugin-options.js';
export { THRESHOLDS } from './thresholds.js';

const USER_CONFIG: UserConfig = defineConfig({
  plugins: PLUGIN_OPTIONS,
  test: INLINE_CONFIG,
}) as UserConfig;

export default USER_CONFIG;
