import { useCallback, useRef, type RefObject } from 'react';
import isDefaultStringRecordExport from '../../../is/is-default-string-record-export.js';
import isStringRecord from '../../../is/is-string-record.js';
import type { DefaultExport } from '../../../types/default-export.js';
import type { Translations } from '../../../types/translations.js';

type EagerTranslations =
  | DefaultExport<Record<string, string>>
  | Record<string, string>;

type LazyTranslations = Promise<EagerTranslations>;

export type State<T> = (locale: T) => Promise<void> | null;

export interface Props<T> {
  readonly onLoadError?: ((locale: keyof T, err: unknown) => void) | undefined;
  readonly translationsRecord: T;
  readonly onLoad: (
    locale: keyof T,
    translations: Record<string, string>,
  ) => void;
}

const DEFAULT_IS_FETCHED: Readonly<
  Record<number | string | symbol, undefined>
> = Object.freeze({});

export default function useLoadTranslations<
  T extends Record<string, Translations | undefined>,
>({ onLoad, onLoadError, translationsRecord }: Props<T>): State<keyof T> {
  const isFetchedRef: RefObject<
    Readonly<Record<keyof T, boolean | undefined>>
  > = useRef(DEFAULT_IS_FETCHED);

  return useCallback(
    (locale: keyof T): Promise<void> | null => {
      // If we've already fetched these locations, don't fetch them again.
      if (isFetchedRef.current[locale] === true) {
        return null;
      }

      isFetchedRef.current = {
        ...isFetchedRef.current,
        [locale]: true,
      };

      const translations: Translations | undefined = translationsRecord[locale];
      if (typeof translations === 'undefined') {
        throw new Error(`Locale not found: ${String(locale)}`);
      }

      if (isStringRecord(translations)) {
        onLoad(locale, translations);
        return null;
      }

      if (isDefaultStringRecordExport(translations)) {
        onLoad(locale, translations.default);
        return null;
      }

      const importedRecord: EagerTranslations | LazyTranslations =
        translations();
      if (isStringRecord(importedRecord)) {
        onLoad(locale, importedRecord);
        return null;
      }

      if (isDefaultStringRecordExport(importedRecord)) {
        onLoad(locale, importedRecord.default);
        return null;
      }

      return importedRecord
        .then((record: EagerTranslations): void => {
          if (isDefaultStringRecordExport(record)) {
            onLoad(locale, record.default);
            return;
          }
          onLoad(locale, record);
        })
        .catch((err: unknown): void => {
          if (typeof onLoadError === 'undefined') {
            throw err;
          }
          onLoadError(locale, err);
        });
    },
    [onLoad, onLoadError, translationsRecord],
  );
}
