import type Publication from '../types/publication.js';

const NEXT = 1;
const NOW: number = Date.now();
const PREVIOUS = -1;
const SAME = 0;

export default function sortPublicationItemsByReactionsPerDay(
  { dateTime: ad, views: an }: Readonly<Publication>,
  { dateTime: bd, views: bn }: Readonly<Publication>,
): number {
  const a: number = an / (NOW - ad);
  const b: number = bn / (NOW - bd);
  if (a < b) {
    return NEXT;
  }
  if (a > b) {
    return PREVIOUS;
  }
  return SAME;
}
