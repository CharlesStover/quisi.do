import CollectionPreferences, {
  CollectionPreferencesProps,
} from '@awsui/components-react/collection-preferences';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import type { TableProps } from '@awsui/components-react/table';
import Table from '@awsui/components-react/table';
import type { TextFilterProps } from '@awsui/components-react/text-filter';
import TextFilter from '@awsui/components-react/text-filter';
import type { ReactElement } from 'react';
import findDefined from '../../utils/find-defined';
import useAwsTable from './table.aws.hook';
import type Props from './types/props';

export default function AwsTable<Item extends Record<string, unknown>>({
  Description,
  columns,
  filter,
  filterPlaceholder,
  header,
  loading,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onVisibleColumnsChange,
  page,
  rows,
  rowsCount,
  rowsPerPage,
  rowsPerPageOptions,
  sortAscending,
  sortColumnIndex,
  visibleColumnIndices,
}: Readonly<Props<Item>>): ReactElement {
  const {
    DescriptionPortal,
    cancelLabel,
    collectionPreferencesTitle,
    columnDefinitions,
    confirmLabel,
    countText,
    currentPageIndex,
    filteringAriaLabel,
    filteringText,
    handleCollectionPreferencesConfirm,
    handlePaginationChange,
    handleSortingChange,
    handleTextFilterChange,
    pageSizePreference,
    pagesCount,
    paginationAriaLabels,
    preferences,
    ref,
    sortingColumn,
    sortingDescending,
    visibleContent,
    visibleContentPreference,
    wrapLines,
    wrapLinesPreference,
  } = useAwsTable({
    Description,
    columns,
    filter,
    onFilterChange,
    onPageChange,
    onRowsPerPageChange,
    onSort,
    onVisibleColumnsChange,
    page,
    rows,
    rowsCount,
    rowsPerPage,
    rowsPerPageOptions,
    sortAscending,
    sortColumnIndex,
    visibleColumnIndices,
  });

  // Workaround until AWS UI supports TypeScript 4.4 exact optional properties.
  // https://github.com/aws/awsui-documentation/issues/14
  const collectionPreferenceProps: Pick<
    CollectionPreferencesProps,
    'pageSizePreference' | 'visibleContentPreference'
  > = {};
  if (typeof pageSizePreference !== 'undefined') {
    collectionPreferenceProps.pageSizePreference = pageSizePreference;
  }
  if (typeof visibleContentPreference !== 'undefined') {
    collectionPreferenceProps.visibleContentPreference =
      visibleContentPreference;
  }

  const tableProps: Pick<
    TableProps<Item>,
    | 'loadingText'
    | 'sortingColumn'
    | 'sortingDescending'
    | 'visibleColumns'
    | 'wrapLines'
  > = {};
  if (findDefined(loading)) {
    tableProps.loadingText = loading;
  }
  if (findDefined(sortingColumn)) {
    tableProps.sortingColumn = sortingColumn;
  }
  if (findDefined(sortingDescending)) {
    tableProps.sortingDescending = sortingDescending;
  }
  if (findDefined(visibleContent)) {
    tableProps.visibleColumns = visibleContent;
  }
  if (findDefined(wrapLines)) {
    tableProps.wrapLines = wrapLines;
  }

  const textFilterProps: Pick<TextFilterProps, 'filteringAriaLabel'> = {};
  if (findDefined(filteringAriaLabel)) {
    textFilterProps.filteringAriaLabel = filteringAriaLabel;
  }

  // Technical debt: We need a `trackBy` prop to uniquely identify the row, but
  //   AWSUI's reliance on this prop is a poor practice unique to AWSUI, and not
  //   something we want to make a part of the `Table` abstraction.
  // Consider using a `Map` or `WeakMap` to associate the row with a unique ID.
  return (
    <div ref={ref}>
      <Table<Item>
        columnDefinitions={columnDefinitions}
        header={<Header>{header}</Header>}
        items={rows}
        loading={findDefined(loading)}
        onSortingChange={handleSortingChange}
        resizableColumns
        stickyHeader
        {...tableProps}
        filter={
          typeof handleTextFilterChange !== 'undefined' && (
            <TextFilter
              countText={countText}
              filteringPlaceholder={filterPlaceholder ?? '...'}
              filteringText={filteringText}
              onChange={handleTextFilterChange}
              {...textFilterProps}
            />
          )
        }
        pagination={
          typeof handlePaginationChange !== 'undefined' && (
            <Pagination
              ariaLabels={paginationAriaLabels}
              currentPageIndex={currentPageIndex}
              onChange={handlePaginationChange}
              pagesCount={pagesCount}
            />
          )
        }
        preferences={
          <CollectionPreferences
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            onConfirm={handleCollectionPreferencesConfirm}
            preferences={preferences}
            title={collectionPreferencesTitle}
            wrapLinesPreference={wrapLinesPreference}
            {...collectionPreferenceProps}
          />
        }
      />
      <DescriptionPortal />
    </div>
  );
}
