import type { Linter } from 'eslint';
import reduceConfigsToRules from './reduce-configs-to-rules.js';

export default function mapConfigsToRules(
  configs: Linter.Config[],
): Linter.RulesRecord {
  return configs.reduce(reduceConfigsToRules, {});
}
