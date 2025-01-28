export default function mapToOptionalNumber(
  value: unknown,
): number | undefined {
  if (typeof value !== 'number') {
    return;
  }

  return value;
}
