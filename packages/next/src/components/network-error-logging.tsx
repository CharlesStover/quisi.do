import type { ReactElement } from 'react';

interface Props {
  readonly includeSubdomains: boolean;
  readonly maxAge: number;
  readonly reportTo: string;
}

export default function NetworkErrorLogging({
  includeSubdomains,
  maxAge,
  reportTo,
}: Props): ReactElement {
  const content: string = JSON.stringify({
    include_subdomains: includeSubdomains,
    max_age: maxAge,
    report_to: reportTo,
  });

  return <meta httpEquiv="NEL" content={content} />;
}
