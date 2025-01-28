import type { HeadingLevel } from './heading-level.js';

const INCREMENT = 1;
const MAX_HEADING_LEVEL = 6;

export default function incrementHeadingLevel(
  level: HeadingLevel,
): HeadingLevel {
  return Math.min(level + INCREMENT, MAX_HEADING_LEVEL) as HeadingLevel;
}
