'use client';

import {
  type ComponentType,
  type ReactElement,
  type ReactNode,
  memo,
} from 'react';
import Loading from '../../components/loading/index.js';
import LoadingComponentContext from '../../contexts/loading-component.js';
import TranslateFunctionContext from '../../contexts/translate-function.js';
import type { Translations } from '../../types/translations.js';
import useProvider from './provider.hook.js';

interface Props<T extends Record<string, Translations | undefined>> {
  readonly LoadingComponent?: ComponentType<unknown>;
  readonly children?: ReactNode;
  readonly onLoadError?: ((locale: keyof T, err: unknown) => void) | undefined;
  readonly fallbackLocale?: keyof T | undefined;
  readonly locale: keyof T;
  readonly translations: T;
}

function I18nProvider<T extends Record<string, Translations | undefined>>({
  LoadingComponent,
  children,
  onLoadError,
  fallbackLocale,
  locale,
  translations: translationsRecord,
}: Props<T>): ReactElement {
  const { translate } = useProvider({
    fallbackLocale,
    locale,
    onLoadError,
    translationsRecord,
  });

  return (
    <LoadingComponentContext.Provider value={LoadingComponent ?? Loading}>
      <TranslateFunctionContext.Provider value={translate}>
        {children}
      </TranslateFunctionContext.Provider>
    </LoadingComponentContext.Provider>
  );
}

export default memo(I18nProvider);
