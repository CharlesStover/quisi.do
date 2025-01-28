import { type ReactElement } from 'react';
import useTheme from '../../hooks/use-theme.js';
import mapPropsToElement from '../../utils/map-props-to-element.jsx';
import validateString from '../../utils/validate-string.js';
import ContentSecurityPolicyDispositionIcon from './content-security-policy-disposition-icon.jsx';
import type ContentSecurityPolicyGroup from './content-security-policy-group.js';
import styles from './content-security-policy-list-item.module.scss';
import ContentSecurityPolicyReportListItem from './content-security-policy-report-list-item.jsx';
import type ContentSecurityPolicyReport from './content-security-policy-report.js';
import mapContentSecurityPolicyReportToListItemProps from './map-content-security-policy-report-to-list-item-props.js';

export interface ContentSecurityPolicyListItemProps
  extends ContentSecurityPolicyGroup {
  readonly expanded: boolean;
  readonly firstDisposition: boolean;
  readonly firstEffectiveDirective: boolean;
  readonly onToggle: VoidFunction;
}

const COLLAPSED_CLASS_NAME: string = validateString(styles['collapsed']);
const EXPANDED_CLASS_NAME: string = validateString(styles['expanded']);
const LIST_ITEM_CLASS_NAME: string = validateString(styles['listItem']);
const NONE = 0;
const NOT_FIRST_CLASS_NAME: string = validateString(styles['notFirst']);
const REPORTS_COUNT_CLASS_NAME: string = validateString(styles['reportsCount']);
const SINGLE = 1;

const FIRST_EFFECTIVE_DIRECTIVE_CLASS_NAME: string = validateString(
  styles['firstEffectiveDirective'],
);

const mapPropsToContentSecurityPolicyReportListItem = mapPropsToElement(
  ContentSecurityPolicyReportListItem,
);

const reduceUrlsToCount = (
  sum: number,
  { count }: ContentSecurityPolicyReport,
): number => sum + count;

const mapUrlsToCount = (urls: readonly ContentSecurityPolicyReport[]): number =>
  urls.reduce(reduceUrlsToCount, NONE);

export default function ContentSecurityPolicyListItem({
  disposition,
  effectiveDirective,
  expanded,
  firstDisposition,
  firstEffectiveDirective,
  onToggle,
  originPathname,
  urls,
}: ContentSecurityPolicyListItemProps): ReactElement {
  // Contexts
  const { displayFontFamily } = useTheme();

  // States
  const getClassName = (): string => {
    const classNames: string[] = [LIST_ITEM_CLASS_NAME];

    if (expanded) {
      classNames.push(EXPANDED_CLASS_NAME);
    } else {
      classNames.push(COLLAPSED_CLASS_NAME);
    }

    if (firstEffectiveDirective) {
      classNames.push(FIRST_EFFECTIVE_DIRECTIVE_CLASS_NAME);
    }

    return classNames.join(' ');
  };

  const getDispositionIconClassName = (): string | undefined => {
    if (firstDisposition) {
      return;
    }
    return NOT_FIRST_CLASS_NAME;
  };

  const getEffectiveDirectiveClassName = (): string => {
    const classNames: string[] = [];

    if (!firstEffectiveDirective) {
      classNames.push(NOT_FIRST_CLASS_NAME);
    }

    return classNames.join(' ');
  };

  const className: string = getClassName();
  const count: number = mapUrlsToCount(urls);
  const dispositionIconClassName: string | undefined =
    getDispositionIconClassName();
  const effectiveDirectiveClassName: string = getEffectiveDirectiveClassName();

  return (
    <li className={className}>
      <button onClick={onToggle}>
        <span className={dispositionIconClassName}>
          <ContentSecurityPolicyDispositionIcon>
            {disposition}
          </ContentSecurityPolicyDispositionIcon>
        </span>
        <span className={effectiveDirectiveClassName}>
          {effectiveDirective}
        </span>
        <span>
          <span tabIndex={0}>{originPathname}</span>
          {count > SINGLE && (
            <span
              className={REPORTS_COUNT_CLASS_NAME}
              style={{
                fontFamily: `"Cairo Play", ${displayFontFamily}`,
              }}
            >
              &times;{count}
            </span>
          )}
        </span>
      </button>
      <ul>
        {urls
          .map(mapContentSecurityPolicyReportToListItemProps)
          .map(mapPropsToContentSecurityPolicyReportListItem)}
      </ul>
    </li>
  );
}
