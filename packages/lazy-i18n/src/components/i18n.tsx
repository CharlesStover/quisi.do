'use client';

import {
  type ComponentType,
  type ReactElement,
  type ReactNode,
  useContext,
} from 'react';
import loadingComponentContext from '../contexts/loading-component.js';
import useTranslate from '../hooks/use-translate.js';
import type { ReactNodeTranslationValue } from '../types/react-node-translation-value.js';
import type TranslateFunction from '../types/translate-function.js';
import mapChildrenToTranslationKey from '../utils/map-children-to-translation-key.js';

interface Props extends Record<string, ReactNodeTranslationValue> {
  children: number | string | (number | string)[];
}

export default function I18n({ children, ...vars }: Props): ReactElement {
  const LoadingComponent: ComponentType<unknown> = useContext(
    loadingComponentContext,
  );
  const translate: TranslateFunction = useTranslate();

  const translation: ReactNode | string | undefined = translate(
    mapChildrenToTranslationKey(children),
    vars,
  );

  // If this locale's translations have not yet loaded, display the loading
  //   Status indicator.
  if (typeof translation === 'undefined') {
    return <LoadingComponent />;
  }

  // If this locale's translations have loaded and are present, display the
  //   Translation.
  return <>{translation}</>;
}
