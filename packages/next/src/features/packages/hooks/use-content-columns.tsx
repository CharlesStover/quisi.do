import { type TranslateFunction, useTranslate } from 'lazy-i18n';
import { type ReactElement, useMemo } from 'react';
import type TableColumn from '../../../types/table-column.js';
import PackageName from '../components/name-cell.js';
import PACKAGE_NAME_COLUMN from '../constants/package-name-column.js';
import type Item from '../types/packages-item.js';
import mapHeaderToDirectDownloadsColumn from '../utils/map-header-to-direct-downloads-column.js';
import mapHeaderToTotalDownloadsColumn from '../utils/map-header-to-total-downloads-column.js';

export default function usePackagesContentColumns(
  filter: string,
): readonly TableColumn<Item>[] {
  // Contexts
  const translate: TranslateFunction = useTranslate();

  const directDownloadsHeader: string = translate('Direct downloads') ?? '...';
  const packageNameHeader: string = translate('Package name') ?? '...';
  const totalDownloadsHeader: string = translate('Total downloads') ?? '...';

  return useMemo(
    (): readonly TableColumn<Item>[] => [
      {
        ...PACKAGE_NAME_COLUMN,
        header: packageNameHeader,
        CellContent({ href, packageName }: Readonly<Item>): ReactElement {
          return (
            <PackageName
              filter={filter}
              href={href}
              packageName={packageName}
            />
          );
        },
      },

      mapHeaderToTotalDownloadsColumn(totalDownloadsHeader),
      mapHeaderToDirectDownloadsColumn(directDownloadsHeader),
    ],
    [directDownloadsHeader, filter, packageNameHeader, totalDownloadsHeader],
  );
}
