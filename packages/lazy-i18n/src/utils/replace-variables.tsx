import type { ReactNode } from 'react';
import isPrimitive from '../is/is-primitive.js';
import mapNodeToFragment from '../map/map-node-to-fragment.js';
import type { ReactNodeTranslationValue } from '../types/react-node-translation-value.js';
import type { StringTranslationValue } from '../types/string-translation-value.js';
import createNewItems from './create-new-items.js';

const ARRAY_INDEX_OFFSET = 1;
const VARIABLE_PREFIX = '$';

export default function replaceVariables(
  translation: string,
  vars?: Readonly<Record<string, StringTranslationValue>>,
): string;
export default function replaceVariables(
  translation: string,
  vars?: Record<string, ReactNodeTranslationValue>,
): ReactNode;
export default function replaceVariables(
  translation: string,
  vars?: Record<string, ReactNodeTranslationValue>,
): ReactNode | string {
  if (typeof vars === 'undefined') {
    return translation;
  }

  const newTranslation: ReactNode[] = [translation];
  const SKIP = 2;
  for (const [variable, value] of Object.entries(vars)) {
    for (
      let translationIndex = 0;
      translationIndex < newTranslation.length;
      translationIndex += SKIP
    ) {
      /**
       * Every even index is a string.
       * Every odd index may be number, string, or ReactNode.
       * 'Hello $world!' --> ['Hello ', <World />, '!']
       */
      const item: string = newTranslation[translationIndex] as string;
      const newItems: ReactNode[] = createNewItems(item, variable, value);
      newTranslation.splice(
        translationIndex,
        VARIABLE_PREFIX.length,
        ...newItems,
      );
      translationIndex += newItems.length - ARRAY_INDEX_OFFSET;
    }
  }

  // String variables
  if (newTranslation.every(isPrimitive)) {
    return newTranslation.join('');
  }

  // React node variables
  return <>{newTranslation.map(mapNodeToFragment)}</>;
}
