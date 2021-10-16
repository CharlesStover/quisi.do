import type { TranslateFunction } from 'lazy-i18n';
import { useTranslate } from 'lazy-i18n';

interface State {
  readonly expandText: string | undefined;
  readonly lastIndex: number;
}

const LAST_INDEX_OFFSET = -1;

export default function useMuiBreadcrumbs(
  breadcrumbs: readonly unknown[],
): State {
  const translate: TranslateFunction = useTranslate();

  return {
    expandText: translate('Show path'),
    lastIndex: breadcrumbs.length + LAST_INDEX_OFFSET,
  };
}