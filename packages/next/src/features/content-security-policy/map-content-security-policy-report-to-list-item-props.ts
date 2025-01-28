import type { Attributes } from 'react';
import type ContentSecurityPolicyReport from './content-security-policy-report.js';

const DEFAULT_COLUMN_NUMBER = 0;
const DEFAULT_LINE_NUMBER = 0;

export default function mapContentSecurityPolicyReportToListItemProps({
  columnNumber,
  count,
  lineNumber,
  sourceFile,
}: ContentSecurityPolicyReport): Required<Attributes> &
  ContentSecurityPolicyReport {
  const getKey = (): string | null => {
    // Assumption: There will only ever be one item with a null `sourceFile`.
    if (sourceFile === null) {
      return null;
    }

    const columnNumberStr: string = (
      lineNumber ?? DEFAULT_COLUMN_NUMBER
    ).toString();

    const lineNumberStr: string = (
      lineNumber ?? DEFAULT_LINE_NUMBER
    ).toString();

    return `${sourceFile} ${lineNumberStr} ${columnNumberStr}`;
  };

  const key: string | null = getKey();
  return {
    columnNumber,
    count,
    key,
    lineNumber,
    sourceFile,
  };
}
