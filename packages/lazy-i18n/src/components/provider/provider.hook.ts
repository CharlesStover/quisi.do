'use client';

import { useCallback, useMemo, useRef, useState, type RefObject } from 'react';
import mapTranslationsRecordToLoadedTranslationsRecord from '../../map/map-translations-record-to-loaded-translations-record.js';
import RunnableTranslateFunction from '../../runnables/runnable-translate-function.js';
import type TranslateFunction from '../../types/translate-function.js';
import type { Translations } from '../../types/translations.js';
import handleNotFound from '../../utils/handle-not-found.js';
import useLoadTranslations from './hooks/use-load-translations.js';

type LoadedTranslationsRecord<K extends number | string | symbol> = Record<
  K,
  Record<string, string> | undefined
>;

export interface Props<T extends Record<string, Translations | undefined>> {
  readonly fallbackLocale?: keyof T | undefined;
  readonly locale: keyof T;
  readonly onLoadError?: ((locale: keyof T, err: unknown) => void) | undefined;
  readonly translationsRecord: T;
}

export interface State {
  readonly asyncLoadFallbackTranslationsEffect: RefObject<Promise<unknown> | null>;
  readonly asyncLoadTranslationsEffect: RefObject<Promise<unknown> | null>;
  readonly translate: TranslateFunction;
}

export default function useProvider<
  T extends Record<string, Translations | undefined>,
>({
  fallbackLocale,
  locale,
  onLoadError,
  translationsRecord,
}: Props<T>): State {
  if (typeof translationsRecord[locale] === 'undefined') {
    throw new Error(`Translations do not exist for locale: ${String(locale)}`);
  }

  if (
    typeof fallbackLocale === 'string' &&
    typeof translationsRecord[fallbackLocale] === 'undefined'
  ) {
    throw new Error(
      `Translations do not exist for fallback locale: ${fallbackLocale}`,
    );
  }

  const asyncLoadFallbackTranslationsEffect: RefObject<Promise<unknown> | null> =
    useRef(null);

  const asyncLoadTranslationsEffect: RefObject<Promise<unknown> | null> =
    useRef(null);

  const [loadedTranslationsRecord, setLoadedTranslationsRecord] = useState(
    (): LoadedTranslationsRecord<keyof T> =>
      mapTranslationsRecordToLoadedTranslationsRecord(translationsRecord),
  );

  const loadTranslations = useLoadTranslations({
    onLoadError,
    translationsRecord,

    onLoad: useCallback(
      (newLocale: keyof T, newTranslations: Record<string, string>): void => {
        setLoadedTranslationsRecord(
          (
            oldLoadedTranslationsRecord: LoadedTranslationsRecord<keyof T>,
          ): LoadedTranslationsRecord<keyof T> => ({
            ...oldLoadedTranslationsRecord,
            [newLocale]: newTranslations,
          }),
        );
      },
      [],
    ),
  });

  const getLoadedFallbackTranslations = ():
    | Record<string, string>
    | undefined => {
    if (typeof fallbackLocale === 'undefined') {
      return;
    }
    return loadedTranslationsRecord[fallbackLocale];
  };

  const loadedFallbackTranslations: Record<string, string> | undefined =
    getLoadedFallbackTranslations();
  const loadedTranslations: Record<string, string> | undefined =
    loadedTranslationsRecord[locale];
  return {
    asyncLoadFallbackTranslationsEffect,
    asyncLoadTranslationsEffect,

    translate: useMemo((): TranslateFunction => {
      const newTranslate: RunnableTranslateFunction =
        new RunnableTranslateFunction({
          fallbackTranslations: loadedFallbackTranslations,
          translations: loadedTranslations,
        });

      newTranslate.on('loadFallbackTranslations', (str: string): void => {
        if (typeof fallbackLocale === 'undefined') {
          throw new Error(`Translation not found: ${str}`);
        }
        asyncLoadFallbackTranslationsEffect.current =
          loadTranslations(fallbackLocale);
      });

      newTranslate.on('loadTranslations', (): void => {
        asyncLoadTranslationsEffect.current = loadTranslations(locale);
      });

      newTranslate.on('notFound', handleNotFound);
      return newTranslate.run.bind(newTranslate);
    }, [
      fallbackLocale,
      loadTranslations,
      loadedFallbackTranslations,
      loadedTranslations,
      locale,
    ]),
  };
}
