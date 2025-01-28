import type { ReactElement } from 'react';
import useTheme from '../../hooks/use-theme.js';
import validateString from '../../utils/validate-string.js';
import styles from './content-security-policy-report-list-item.module.scss';
import type ContentSecurityPolicyReport from './content-security-policy-report.js';
import ContentSecurityPolicySourceFile from './content-security-policy-source-file.jsx';

const CLASS_NAME: string = validateString(styles['listItem']);
const COUNT_CLASS_NAME: string = validateString(styles['count']);
const SINGLE = 1;

export default function ContentSecurityPolicyReportListItem({
  columnNumber,
  count,
  lineNumber,
  sourceFile,
}: ContentSecurityPolicyReport): ReactElement {
  const { displayFontFamily } = useTheme();

  if (sourceFile === null) {
    return <li className={CLASS_NAME}>Unknown source</li>;
  }

  return (
    <li className={CLASS_NAME}>
      <ContentSecurityPolicySourceFile
        columnNumber={columnNumber}
        lineNumber={lineNumber}
      >
        {sourceFile}
      </ContentSecurityPolicySourceFile>{' '}
      {count > SINGLE && (
        <span
          className={COUNT_CLASS_NAME}
          style={{
            fontFamily: `"Cairo Play", ${displayFontFamily}`,
          }}
        >
          &times;{count}
        </span>
      )}
    </li>
  );
}
