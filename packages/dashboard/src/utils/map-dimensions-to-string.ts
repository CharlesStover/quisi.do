import type { MetricDimensions } from '@quisido/worker';

const mapEntryToString = ([key, value]: readonly [
  string,
  boolean | number | string,
]): string => `${key}=${value}`;

export default function mapDimensionsToString(
  dimensions: MetricDimensions,
): string {
  return Object.entries(dimensions).map(mapEntryToString).join(' ');
}
