import type { ReactElement } from 'react';

interface Props extends Intl.NumberFormatOptions {
  readonly children: number | string;
  readonly locale?: string | undefined;
}

const mapChildrenToNumber = (children: number | string): number => {
  if (typeof children === 'string') {
    return parseFloat(children);
  }

  return children;
};

export default function NumberFormat({
  children,
  locale,
  ...options
}: Props): ReactElement {
  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat(
    locale,
    options,
  );

  return <>{numberFormat.format(mapChildrenToNumber(children))}</>;
}
