import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import Header from '../../../../components/header';
import Select from '../../../../components/select';
import type Sort from '../../constants/publications-sort';
import usePublicationsHeader from './header.hook';

interface Props {
  readonly onSortChange: (value: string | undefined) => void;
  readonly sort: Sort;
}

export default function PublicationsHeader({
  onSortChange,
  sort,
}: Readonly<Props>): ReactElement {
  const { sortOptions } = usePublicationsHeader();

  return (
    <Header
      actions={
        <Select
          label={<I18n>Sort by</I18n>}
          labelDirection="row"
          onChange={onSortChange}
          options={sortOptions}
          value={sort}
        />
      }
    >
      <I18n>Publications</I18n>
    </Header>
  );
}
