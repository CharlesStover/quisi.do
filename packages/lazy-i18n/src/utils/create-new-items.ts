import type { ReactNode } from 'react';
import type { ReactNodeTranslationValue } from '../types/react-node-translation-value.js';

const ARRAY_INDEX_OFFSET = 1;
const LAST_ITEM = 1;
const SKIP = 2;
const START = 0;
const VARIABLE_PREFIX = '$';

export default function createNewItems(
  item: string,
  variable: string,
  value: ReactNodeTranslationValue,
): ReactNode[] {
  const items: ReactNode[] = item.split(`${VARIABLE_PREFIX}${variable}`);

  for (
    let itemIndex = START;
    itemIndex < items.length - LAST_ITEM;
    itemIndex += SKIP
  ) {
    items.splice(itemIndex + ARRAY_INDEX_OFFSET, START, value as ReactNode);
  }

  return items;
}
