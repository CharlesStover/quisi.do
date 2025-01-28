const BASE = 10;

export default function round(
  value: number | undefined,
  places: number,
): number | undefined {
  if (typeof value === 'undefined') {
    return;
  }

  return Math.round(value * BASE ** places) / BASE ** places;
}
