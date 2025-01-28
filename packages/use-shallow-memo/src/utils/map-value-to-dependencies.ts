import { sortEntriesByKey } from 'fmrs';
import reduceEntriesToDependencies from './reduce-entries-to-dependencies.js';

export default function mapValueToDependencies(
  value: boolean | null | number | object | string | undefined,
): readonly unknown[] {
  if (typeof value !== 'object') {
    return [value];
  }

  if (value === null) {
    return [null];
  }

  return Object.entries(value)
    .sort(sortEntriesByKey)
    .reduce(reduceEntriesToDependencies, []);
}
