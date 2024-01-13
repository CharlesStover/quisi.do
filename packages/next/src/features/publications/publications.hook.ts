'use client';

import { type TranslateFunction, useTranslate } from 'lazy-i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAsyncState from '../../modules/use-async-state.js';
import type DevArticle from '../../types/dev-article.js';
import type MediumArticle from '../../types/medium-article.js';
import Sort from './constants/publications-sort.js';
import useItems from './hooks/use-content-items.js';
import type Publication from './types/publication.js';
import filterByPublicationsSort from './utils/filter-by-publications-sort.js';
import filterItemsByMinimumViews from './utils/filter-publications-items-by-minimum-views.js';
import mapSortToFunction from './utils/map-publications-sort-to-function.js';

interface State {
  readonly handleMediumApiBannerDismiss: VoidFunction;
  readonly handleMinimumViewsBannerDismiss: VoidFunction;
  readonly handleSortChange: (sort: string | undefined) => void;
  readonly isMediumApiBannerVisible: boolean;
  readonly isMinimumViewsBannerVisible: boolean;
  readonly items: readonly Publication[];
  readonly loading: string | undefined;
  readonly sort: Sort;
}

const DEFAULT_SORT: Sort = Sort.ViewsPerDay;

const getDevData = async (): Promise<readonly DevArticle[]> => {
  const response: Response = await window.fetch(
    'https://dev.to/api/articles?username=charlesstover',
  );
  return response.json();
};

const getMediumData = async (): Promise<Record<string, MediumArticle>> => {
  const response: Response = await window.fetch(
    'https://medium.cscdn.net/charles-stover.json',
  );

  return response.json();
};

export default function usePublicationsContents(): State {
  // Contexts
  const translate: TranslateFunction = useTranslate();

  // States
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);

  const {
    data: devData,
    loading: isDevLoading,
    request: requestDev,
  } = useAsyncState<readonly DevArticle[]>();

  const {
    data: mediumData,
    loading: isMediumLoading,
    request: requestMedium,
  } = useAsyncState<Record<string, MediumArticle>>();

  const [isMediumApiBannerVisible, setIsMediumApiBannerVisible] =
    useState(true);

  const [isMinimumViewsBannerVisible, setIsMinimumViewsBannerVisible] =
    useState(true);

  const items: readonly Publication[] = useItems({
    devData,
    mediumData,
  });

  // Effects
  useEffect((): void => {
    requestDev(getDevData);
  }, [getDevData, requestDev]);

  useEffect((): void => {
    requestMedium(getMediumData);
  }, [getMediumData, requestMedium]);

  return {
    isMediumApiBannerVisible,
    isMinimumViewsBannerVisible,
    sort,

    handleMediumApiBannerDismiss: useCallback((): void => {
      setIsMediumApiBannerVisible(false);
    }, []),

    handleMinimumViewsBannerDismiss: useCallback((): void => {
      setIsMinimumViewsBannerVisible(false);
    }, []),

    handleSortChange: useCallback((newSort: string | undefined): void => {
      if (typeof newSort === 'undefined') {
        setSort(DEFAULT_SORT);
        return;
      }
      if (!filterByPublicationsSort(newSort)) {
        throw new Error(
          `Expected a publication sort option, but received: ${newSort}`,
        );
      }
      setSort(newSort);
    }, []),

    items: useMemo((): readonly Publication[] => {
      const newItems: Publication[] = [...items];
      newItems.sort(mapSortToFunction(sort));
      return newItems.filter(filterItemsByMinimumViews);
    }, [items, sort]),

    loading: useMemo((): string | undefined => {
      if (!isDevLoading && !isMediumLoading) {
        return;
      }
      return translate('Loading publications') ?? '...';
    }, [isDevLoading, isMediumLoading, translate]),
  };
}
