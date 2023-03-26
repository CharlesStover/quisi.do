import isUndefined from '../../../utils/is-undefined';
import type Publication from '../types/publication';

const NEXT = 1;
const PREVIOUS = -1;
const SAME = 0;

export default function sortPublicationItemsByReadingTime(
  { readingTime: a }: Readonly<Publication>,
  { readingTime: b }: Readonly<Publication>,
): number {
  if (isUndefined(a)) {
    if (isUndefined(b)) {
      return SAME;
    }
    return NEXT;
  }
  if (isUndefined(b)) {
    return PREVIOUS;
  }
  if (a < b) {
    return NEXT;
  }
  if (a > b) {
    return PREVIOUS;
  }
  return SAME;
}
