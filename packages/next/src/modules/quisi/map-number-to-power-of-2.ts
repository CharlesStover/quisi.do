const BASE = 2;

export default function mapNumberToPowerOf2(num: number): number {
  for (let power = 0; ; power++) {
    const pow: number = BASE ** power;
    if (pow < num) {
      continue;
    }

    return pow;
  }
}
