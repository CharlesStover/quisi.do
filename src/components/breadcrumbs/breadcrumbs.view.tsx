import type { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';
import BreadcrumbGroup from '@awsui/components-react/breadcrumb-group';
import type { ReactElement } from 'react';
import useBreadcrumbs from './breadcrumbs.hook';

interface Props {
  readonly children: readonly BreadcrumbGroupProps.Item[] | undefined;
}

const DEFAULT_CHILDREN: readonly BreadcrumbGroupProps.Item[] = Object.freeze(
  [],
);

export default function Breadcrumbs({
  children = DEFAULT_CHILDREN,
}: Props): ReactElement {
  const { ariaLabel, handleFollow, items } = useBreadcrumbs(children);

  // Workaround until AWS UI supports TypeScript 4.4 exact optional properties.
  // https://github.com/aws/awsui-documentation/issues/14
  const optionalProps: Pick<BreadcrumbGroupProps, 'ariaLabel'> = {};
  if (typeof ariaLabel !== 'undefined') {
    optionalProps.ariaLabel = ariaLabel;
  }

  return (
    <BreadcrumbGroup items={items} onFollow={handleFollow} {...optionalProps} />
  );
}
