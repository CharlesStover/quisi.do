import { assert } from 'vitest';

interface Icon {
  readonly sizes: string;
  readonly type: string;
}

const BASE = 10;
const SPLASH_SCREEN_ICON_SIZE = 512;

export default function findSplashScreenIcon({ sizes, type }: Icon): boolean {
  const sizeMatches: RegExpExecArray | null =
    /^(?<widthStr>\d+)x(?<heightStr>\d+)$/u.exec(sizes);

  assert(sizeMatches !== null);
  const { groups } = sizeMatches;
  assert(typeof groups !== 'undefined');
  const { heightStr, widthStr } = groups;
  assert(typeof heightStr !== 'undefined');
  assert(typeof widthStr !== 'undefined');
  const height: number = parseInt(heightStr, BASE);
  const width: number = parseInt(widthStr, BASE);

  return (
    height >= SPLASH_SCREEN_ICON_SIZE &&
    width >= SPLASH_SCREEN_ICON_SIZE &&
    type === 'image/png'
  );
}
