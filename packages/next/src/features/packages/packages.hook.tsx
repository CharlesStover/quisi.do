'use client';

import { type TranslateFunction, useTranslate } from 'lazy-i18n';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import useNpmDownloads from '../../hooks/use-npm-downloads.js';
import type TableColumn from '../../types/table-column.js';
import type TableRowsPerPageOption from '../../types/table-rows-per-page-option.js';
import Paginator from '../../utils/paginator.js';
import useColumns from './hooks/use-content-columns.js';
import type Item from './types/packages-item.js';
import filterDefaultPackage from './utils/filter-default-package.js';
import filterPackagesByMinimumDownloads from './utils/filter-packages-by-minimum-downloads.js';
import mapNpmDownloadsEntryToItem from './utils/map-npm-downloads-entry-to-item.js';

interface State {
  readonly columns: readonly TableColumn<Item>[];
  readonly filter: string;
  readonly filterPlaceholder: string | undefined;
  readonly handleBannerDismiss: VoidFunction;
  readonly handleFilterChange: (filter: string) => void;
  readonly handlePageChange: (page: number) => void;
  readonly handleRowsPerPageChange: (rowsPerPage: number) => void;
  readonly handleSort: (columnIndex: number, ascending: boolean) => void;
  readonly isBannerVisible: boolean;
  readonly loading: string | undefined;
  readonly page: number;
  readonly rows: readonly Item[];
  readonly rowsCount: number;
  readonly rowsPerPage: number;
  readonly rowsPerPageOptions: readonly TableRowsPerPageOption[];
  readonly sortAscending: boolean;
  readonly sortColumnIndex: number;
  readonly visibleColumnIndices: readonly number[];
  readonly handleVisibleColumnsChange: (
    visibleColumnIndices: readonly number[],
  ) => void;
}

const BASE_PAGE_SIZE = 5;
const DEFAULT_PAGE = 1;
const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_SORT_COLUMN_INDEX = 1;
const FIRST = 0;
const MULTIPLIER = 2;
const SECOND = 1;
const SQUARED = 2;

const DEFAULT_VISIBLE_COLUMN_INDICES: readonly number[] = [FIRST, SECOND];

// 5, 10, 20, 50
const PAGE_SIZES: number[] = [
  BASE_PAGE_SIZE,
  BASE_PAGE_SIZE * MULTIPLIER,
  BASE_PAGE_SIZE * Math.pow(MULTIPLIER, SQUARED),
  Math.pow(BASE_PAGE_SIZE, SQUARED) * MULTIPLIER,
];

export default function usePackagesContent(): State {
  // Contexts
  const { data, loading: isLoading } = useNpmDownloads();
  const translate: TranslateFunction = useTranslate();

  // States
  const [filter, setFilter] = useState('');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [sortAscending, setSortAscending] = useState(false);
  const [sortColumnIndex, setSortColumnIndex] = useState(
    DEFAULT_SORT_COLUMN_INDEX,
  );
  const [visibleColumnIndices, setVisibleColumnIndices] = useState(
    DEFAULT_VISIBLE_COLUMN_INDICES,
  );

  const deferredFilter: string = useDeferredValue(filter);
  const deferredPage: number = useDeferredValue(page);
  const deferredRowsPerPage: number = useDeferredValue(rowsPerPage);
  const deferredSortAscending: boolean = useDeferredValue(sortAscending);
  const deferredSortColumnIndex: number = useDeferredValue(sortColumnIndex);

  const columns: readonly TableColumn<Item>[] = useColumns(deferredFilter);

  const items: readonly Item[] = useMemo((): readonly Item[] => {
    if (typeof data === 'undefined') {
      return [];
    }
    const entries: [string, readonly number[]][] = Object.entries(data);
    return entries
      .map(mapNpmDownloadsEntryToItem)
      .filter(filterDefaultPackage)
      .filter(filterPackagesByMinimumDownloads);
  }, [data]);

  const filteredItems: readonly Item[] = useMemo((): readonly Item[] => {
    const filterByFilter = ({ packageName }: Readonly<Item>): boolean =>
      packageName.includes(deferredFilter);
    return items.filter(filterByFilter);
  }, [deferredFilter, items]);

  const paginator: Paginator = useMemo(
    (): Paginator =>
      new Paginator({
        page: deferredPage,
        rowsPerPage: deferredRowsPerPage,
      }),
    [deferredPage, deferredRowsPerPage],
  );

  return {
    columns,
    filter,
    filterPlaceholder: translate('Filter packages'),
    handleFilterChange: setFilter,
    handlePageChange: setPage,
    handleRowsPerPageChange: setRowsPerPage,
    handleVisibleColumnsChange: setVisibleColumnIndices,
    isBannerVisible,
    page,
    rowsCount: filteredItems.length,
    rowsPerPage,
    sortAscending,
    sortColumnIndex,
    visibleColumnIndices,

    handleBannerDismiss: useCallback((): void => {
      setIsBannerVisible(false);
    }, []),

    handleSort: useCallback((columnIndex: number, ascending: boolean): void => {
      setSortAscending(ascending);
      setSortColumnIndex(columnIndex);
    }, []),

    loading: useMemo((): string | undefined => {
      if (!isLoading) {
        return;
      }
      return translate('Loading packages') ?? '...';
    }, [isLoading, translate]),

    rows: useMemo((): readonly Item[] => {
      const newRows: Item[] = [...filteredItems];

      const sortColumn: TableColumn<Item> | undefined =
        columns[deferredSortColumnIndex];
      if (typeof sortColumn === 'undefined') {
        throw new Error(`Expected column at index ${deferredSortColumnIndex}.`);
      }

      newRows.sort(sortColumn.sort);
      if (!deferredSortAscending) {
        newRows.reverse();
      }

      return paginator.paginate(newRows);
    }, [
      columns,
      deferredSortAscending,
      deferredSortColumnIndex,
      filteredItems,
      paginator,
    ]),

    rowsPerPageOptions: useMemo((): readonly TableRowsPerPageOption[] => {
      const mapNumberToPageSizeOption = (
        value: number,
      ): TableRowsPerPageOption => ({
        label: translate('$n packages', {
          n: value,
        }),
        value,
      });

      return PAGE_SIZES.map(mapNumberToPageSizeOption);
    }, [translate]),
  };
}
