import type { CollectionPreferencesProps } from '@awsui/components-react/collection-preferences';
import type { NonCancelableCustomEvent } from '@awsui/components-react/interfaces';
import type { NonCancelableEventHandler } from '@awsui/components-react/internal/events';
import type { PaginationProps } from '@awsui/components-react/pagination';
import type { TableProps } from '@awsui/components-react/table';
import type { TextFilterProps } from '@awsui/components-react/text-filter';
import type { TranslateFunction } from 'lazy-i18n';
import { useTranslate } from 'lazy-i18n';
import type { ComponentType, MutableRefObject } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import useAwsuiTableItemDescription from 'use-awsui-table-item-description';
import type ReadonlyColllectionPreferencesEvent from '../../types/readonly-aws-collection-preferences-event copy';
import type ReadonlyAwsTableSortingEvent from '../../types/readonly-aws-table-sorting-event';
import type TableColumn from '../../types/table-column';
import type TableRowsPerPageOption from '../../types/table-rows-per-page-option';
import isDefined from '../../utils/is-defined';
import isUndefined from '../../utils/is-undefined';
import useAriaLabels from './hooks/use-cloudscape-aria-labels';
import useAwsCountText from './hooks/use-aws-count-text';
import type AwsuiPaginationChangeHandler from './types/awsui-pagination-change-handler';
import mapColumnToAwsVisibleContentOption from './utils/map-column-to-aws-visible-content-option';
import mapColumnsToAwsDefinitions from './utils/map-columns-to-aws-definitions';
import mapNumberDispatchToAwsPaginationChangeHandler from './utils/map-number-dispatch-to-aws-pagination-change-handler';
import mapRowsPerPageOptionToPageSizeOption from './utils/map-rows-per-page-option-to-page-size-option';
import mapSortingColumnToIndex from './utils/map-sorting-column-to-index';

interface Props<Item> {
  readonly Description?: ComponentType<Item> | undefined;
  readonly columns: readonly TableColumn<Item>[];
  readonly filter?: string | undefined;
  readonly onFilterChange?: ((filter: string) => void) | undefined;
  readonly onPageChange?: ((page: number) => void) | undefined;
  readonly onRowsPerPageChange?: ((rowsPerPage: number) => void) | undefined;
  readonly onSort: (columnIndex: number, ascending: boolean) => void;
  readonly page?: number | undefined;
  readonly rows: readonly Item[];
  readonly rowsCount: number;
  readonly rowsPerPage: number;
  readonly rowsPerPageOptions?: readonly TableRowsPerPageOption[] | undefined;
  readonly sortAscending: boolean;
  readonly sortColumnIndex?: number | undefined;
  readonly visibleColumnIndices?: readonly number[] | undefined;
  readonly onVisibleColumnsChange?:
    | ((visibleColumnIndices: readonly number[]) => void)
    | undefined;
}

interface State<Item> {
  readonly DescriptionPortal: ComponentType<Record<string, never>>;
  readonly ariaLabels: TableProps.AriaLabels<Item>;
  readonly cancelLabel: string;
  readonly collectionPreferencesTitle: string;
  readonly columnDefinitions: readonly TableProps.ColumnDefinition<Item>[];
  readonly columnDisplay: readonly TableProps.ColumnDisplayProperties[];
  readonly confirmLabel: string;
  readonly contentDensity: 'comfortable' | 'compact';
  readonly contentDensityPreference: CollectionPreferencesProps.ContentDensityPreference;
  readonly contentDisplayPreference: CollectionPreferencesProps.ContentDisplayPreference;
  readonly countText: string;
  readonly currentPageIndex: number;
  readonly filteringAriaLabel: string | undefined;
  readonly filteringText: string;
  readonly pagesCount: number;
  readonly paginationAriaLabels: PaginationProps.Labels;
  readonly preferences: CollectionPreferencesProps.Preferences;
  readonly ref: MutableRefObject<HTMLDivElement | null>;
  readonly sortingColumn: TableProps.SortingColumn<Item> | undefined;
  readonly sortingDescending: boolean | undefined;
  readonly stripedRows: boolean;
  readonly stripedRowsPreference: CollectionPreferencesProps.StripedRowsPreference;
  readonly visibleColumns: readonly string[] | undefined;
  readonly wrapLines: boolean | undefined;
  readonly wrapLinesPreference: CollectionPreferencesProps.WrapLinesPreference;
  readonly handleCollectionPreferencesConfirm: NonCancelableEventHandler<
    CollectionPreferencesProps.Preferences<void>
  >;
  readonly handlePaginationChange:
    | NonCancelableEventHandler<PaginationProps.ChangeDetail>
    | undefined;
  readonly handleSortingChange: (
    event: ReadonlyAwsTableSortingEvent<Item>,
  ) => void;
  readonly handleTextFilterChange:
    | NonCancelableEventHandler<TextFilterProps.ChangeDetail>
    | undefined;
  readonly pageSizePreference:
    | CollectionPreferencesProps.PageSizePreference
    | undefined;
  readonly visibleContentPreference:
    | CollectionPreferencesProps.VisibleContentPreference
    | undefined;
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS: readonly never[] = [];
const FIRST_PAGE = 1;

export default function useAwsTableHook<Item extends Record<string, unknown>>({
  Description,
  columns,
  filter,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onVisibleColumnsChange,
  page = FIRST_PAGE,
  rows,
  rowsCount,
  rowsPerPage,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  sortAscending,
  sortColumnIndex,
  visibleColumnIndices,
}: Readonly<Props<Item>>): State<Item> {
  // Contexts
  const translate: TranslateFunction = useTranslate();

  // States
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [stripedRows, setStripedRows] = useState(true);
  const [wrapLines, setWrapLines] = useState(false);

  const [columnDisplay] = useState<
    readonly TableProps.ColumnDisplayProperties[]
  >([]);

  const [contentDensity, setContentDensity] = useState<
    'comfortable' | 'compact'
  >('comfortable');

  const columnDefinitions: readonly TableProps.ColumnDefinition<Item>[] =
    useMemo((): readonly TableProps.ColumnDefinition<Item>[] => {
      return mapColumnsToAwsDefinitions(columns);
    }, [columns]);

  const visibleColumns: readonly string[] | undefined = useMemo(():
    | readonly string[]
    | undefined => {
    if (typeof visibleColumnIndices === 'undefined') {
      return;
    }

    const mapColumnIndexToContent = (columnIndex: number): string => {
      const columnDefinition: TableProps.ColumnDefinition<Item> | undefined =
        columnDefinitions[columnIndex];

      if (isUndefined(columnDefinition)) {
        throw new Error(`Expected column definition #${columnIndex} to exist.`);
      }

      const content: string | undefined = columnDefinition.id;
      if (isUndefined(content)) {
        throw new Error(
          `Expected column definition #${columnIndex} to have an ID.`,
        );
      }

      return content;
    };

    return visibleColumnIndices.map(mapColumnIndexToContent);
  }, [columnDefinitions, visibleColumnIndices]);

  // Effects
  const DescriptionPortal: ComponentType<Record<string, never>> =
    useAwsuiTableItemDescription({
      Component: Description,
      colSpan: visibleColumnIndices?.length ?? columnDefinitions.length,
      items: rows,
      ref,
    });

  return {
    DescriptionPortal,
    ariaLabels: useAriaLabels(),
    cancelLabel: translate('Cancel') ?? '...',
    collectionPreferencesTitle: translate('Preferences') ?? '...',
    columnDefinitions,
    columnDisplay,
    confirmLabel: translate('Confirm') ?? '...',
    contentDensity,
    countText: useAwsCountText(rowsCount),
    currentPageIndex: page,
    filteringAriaLabel: translate('Filter packages'), // TODO
    filteringText: filter ?? '',
    pagesCount: Math.ceil(rowsCount / rowsPerPage),
    ref,
    sortingDescending: !sortAscending,
    stripedRows,
    visibleColumns,
    wrapLines,

    contentDensityPreference: useMemo(
      (): CollectionPreferencesProps.ContentDensityPreference => ({
        label: translate('Compact mode') ?? '...',
        description:
          translate(
            'Select to display content in denser, more compact mode.',
          ) ?? '...',
      }),
      [translate],
    ),

    /*
    // TODO: Map these from columns.
    // TODO: Copy this logic to `./table.cloudscape.hook.ts`.
    contentDisplayPreference: useMemo(
      (): CollectionPreferencesProps.ContentDisplayPreference => ({
        title: translate('Column preferences') ?? '...',
        description:
          translate("Customize the columns' visibility and order.") ?? '...',
        options: [
          {
            id: 'packageName',
            label: 'Package name',
            alwaysVisible: true,
          },
          {
            id: 'totalDownloads',
            label: 'Total downloads',
            alwaysVisible: false,
          },
        ],
        // liveAnnouncementDndStarted?: (position: number, total: number) => string;
        // liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
        // liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
        // liveAnnouncementDndDiscarded?: string;
        // dragHandleAriaLabel?: string;
        // dragHandleAriaDescription?: string;
      }),
      [translate],
    ),
    */
    contentDisplayPreference: {
      options: [],
      title: '',
    },

    handleCollectionPreferencesConfirm: useCallback(
      (e: ReadonlyColllectionPreferencesEvent<void>): void => {
        if (isDefined(e.detail.contentDensity)) {
          setContentDensity(e.detail.contentDensity);
        }

        if (isDefined(e.detail.pageSize)) {
          onPageChange?.(FIRST_PAGE);
          onRowsPerPageChange?.(e.detail.pageSize);
        }

        if (isDefined(e.detail.stripedRows)) {
          setStripedRows(e.detail.stripedRows);
        }

        if (isDefined(e.detail.visibleContent)) {
          const mapContentItemToColumn = (item: string): number => {
            const findColumnDefinition = ({
              id,
            }: Readonly<TableProps.ColumnDefinition<Item>>): boolean => {
              return id === item;
            };
            return columnDefinitions.findIndex(findColumnDefinition);
          };

          const mapContentToColumns = (
            content: readonly string[],
          ): readonly number[] => {
            return content.map(mapContentItemToColumn);
          };

          const newVisibleColumns: readonly number[] = mapContentToColumns(
            e.detail.visibleContent,
          );
          onVisibleColumnsChange?.(newVisibleColumns);
        }

        if (isDefined(e.detail.wrapLines)) {
          setWrapLines(e.detail.wrapLines);
        }
      },
      [
        columnDefinitions,
        onPageChange,
        onRowsPerPageChange,
        onVisibleColumnsChange,
      ],
    ),

    handlePaginationChange: useMemo(():
      | AwsuiPaginationChangeHandler
      | undefined => {
      if (typeof onPageChange === 'undefined') {
        return;
      }
      return mapNumberDispatchToAwsPaginationChangeHandler(onPageChange);
    }, [onPageChange]),

    handleSortingChange: useCallback(
      (e: ReadonlyAwsTableSortingEvent<Item>): void => {
        const columnIndex: number = mapSortingColumnToIndex(
          e.detail.sortingColumn,
        );
        onSort(columnIndex, e.detail.isDescending !== true);
      },
      [onSort],
    ),

    handleTextFilterChange: useMemo(():
      | NonCancelableEventHandler<TextFilterProps.ChangeDetail>
      | undefined => {
      if (typeof onFilterChange === 'undefined') {
        return;
      }

      return (
        e: Readonly<
          NonCancelableCustomEvent<Readonly<TextFilterProps.ChangeDetail>>
        >,
      ): void => {
        onFilterChange(e.detail.filteringText);
        onPageChange?.(FIRST_PAGE);
      };
    }, [onFilterChange, onPageChange]),

    pageSizePreference: useMemo(():
      | CollectionPreferencesProps.PageSizePreference
      | undefined => {
      if (typeof onRowsPerPageChange === 'undefined') {
        return;
      }

      return {
        options: rowsPerPageOptions.map(mapRowsPerPageOptionToPageSizeOption),
        title: translate('Select page size.') ?? '...',
      };
    }, [onRowsPerPageChange, rowsPerPageOptions, translate]),

    paginationAriaLabels: useMemo(
      (): PaginationProps.Labels => ({
        nextPageLabel: translate('Go to next page.') ?? 'Go to next page.',
        previousPageLabel:
          translate('Go to previous page.') ?? 'Go to previous page.',
      }),
      [translate],
    ),

    preferences: useMemo((): CollectionPreferencesProps.Preferences<void> => {
      if (typeof visibleColumns === 'undefined') {
        return {
          pageSize: rowsPerPage,
          stripedRows,
          wrapLines,
        };
      }

      return {
        pageSize: rowsPerPage,
        stripedRows,
        visibleContent: visibleColumns,
        wrapLines,
      };
    }, [rowsPerPage, stripedRows, visibleColumns, wrapLines]),

    sortingColumn: useMemo((): TableProps.SortingColumn<Item> | undefined => {
      if (isUndefined(sortColumnIndex)) {
        return;
      }

      return {
        sortingField: sortColumnIndex.toString(),
      };
    }, [sortColumnIndex]),

    stripedRowsPreference: useMemo(
      (): CollectionPreferencesProps.StripedRowsPreference => ({
        label: translate('Striped rows') ?? '...',
        description:
          translate('Select to add alternating shaded rows.') ?? '...',
      }),
      [translate],
    ),

    visibleContentPreference: useMemo(():
      | CollectionPreferencesProps.VisibleContentPreference
      | undefined => {
      if (typeof onVisibleColumnsChange === 'undefined') {
        return;
      }

      return {
        title: translate('Select visible columns.') ?? '...',
        options: [
          {
            label: translate('Properties') ?? '...',
            options: columns.map(mapColumnToAwsVisibleContentOption),
          },
        ],
      };
    }, [columns, onVisibleColumnsChange, translate]),

    wrapLinesPreference: useMemo(
      (): CollectionPreferencesProps.WrapLinesPreference => ({
        label: translate('Wrap lines') ?? '...',
        description:
          translate('Select to see all the text and wrap the lines.') ?? '...',
      }),
      [translate],
    ),
  };
}
