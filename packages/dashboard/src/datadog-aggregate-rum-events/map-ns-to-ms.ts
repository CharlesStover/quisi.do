import { NANOSECONDS_PER_MILLISECOND } from '../constants/time.js';

export default function mapNsToMs(ns: number | undefined): number | undefined {
  if (typeof ns === 'undefined') {
    return;
  }

  return Math.round(ns / NANOSECONDS_PER_MILLISECOND);
}
