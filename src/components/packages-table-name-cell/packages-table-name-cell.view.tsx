import Link from '@awsui/components-react/link';
import type { ReactElement } from 'react';
import EmphasizeSubstring from '../../components/emphasize-substring';
import type Item from '../../types/packages-table-item';
import usePackagesTableNameCell from './packages-table-name-cell.hook';

interface Props extends Item {
  readonly filteringText: string;
}

export default function PackagesTableNameCell({
  filteringText,
  packageName,
  repositoryName,
}: Props): ReactElement {
  const { href, index } = usePackagesTableNameCell({
    filteringText,
    packageName,
    repositoryName,
  });

  return (
    <Link href={href} target="_blank">
      <EmphasizeSubstring index={index} length={filteringText.length}>
        {packageName}
      </EmphasizeSubstring>
    </Link>
  );
}
