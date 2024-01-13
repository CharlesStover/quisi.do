'use client'; // lazy-i18n

import I18n from 'lazy-i18n';
import { type ReactElement } from 'react';
import Banner from '../../components/banner.js';
import Div from '../../components/div/index.js';
import NumberFormat from '../../components/number-format/index.js';
import Table from '../../components/table/index.js';
import Description from './components/description/index.js';
import MINIMUM_DOWNLOADS from './constants/minimum-package-downloads.js';
import usePackages from './packages.hook.js';
import type Item from './types/packages-item.js';

export default function Packages(): ReactElement {
  const {
    columns,
    filter,
    filterPlaceholder,
    handleBannerDismiss,
    handleFilterChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    handleVisibleColumnsChange,
    isBannerVisible,
    loading,
    page,
    rows,
    rowsCount,
    rowsPerPage,
    rowsPerPageOptions,
    sortAscending,
    sortColumnIndex,
    visibleColumnIndices,
  } = usePackages();

  return (
    <>
      {isBannerVisible && (
        <Div marginBottom="medium">
          <Banner onDismiss={handleBannerDismiss}>
            <I18n count={<NumberFormat>{MINIMUM_DOWNLOADS}</NumberFormat>}>
              Only packages with more than $count downloads are shown.
            </I18n>
          </Banner>
        </Div>
      )}
      <Table<Item>
        Description={Description}
        columns={columns}
        filter={filter}
        filterPlaceholder={filterPlaceholder}
        header={<I18n>Packages</I18n>}
        loading={loading}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        onVisibleColumnsChange={handleVisibleColumnsChange}
        page={page}
        rows={rows}
        rowsCount={rowsCount}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        sortAscending={sortAscending}
        sortColumnIndex={sortColumnIndex}
        visibleColumnIndices={visibleColumnIndices}
      />
    </>
  );
}
