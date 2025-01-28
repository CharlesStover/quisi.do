'use client';

import I18n from 'lazy-i18n';
import {
  memo,
  useEffect,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import NumberFormat from '../components/number-format.jsx';
import Gauge, { type Threshold } from '../modules/quisi/gauge.jsx';
import Paragraph from '../modules/quisi/paragraph.jsx';
import Section from '../modules/quisi/section.jsx';
import useAsyncState from '../modules/use-async-state/index.js';
import type DashboardApiResponse from '../types/dashboard-api-response.js';
import isDashboardApiResponse from '../utils/is-dashboard-api-response.js';
import validateString from '../utils/validate-string.js';
import styles from './dashboard.module.scss';

const GAUGE_CLASS_NAME: string = validateString(styles['gauge']);
const GAUGE_NEEDLE_CLASS_NAME: string = validateString(styles['gaugeNeedle']);
const LIST_CLASS_NAME: string = validateString(styles['list']);

const DASHBOARD_ENDPOINT: string = validateString(
  process.env['DASHBOARD_ENDPOINT'],
);

const NEGATIVE_ACTIVE_CLASS_NAME: string = validateString(
  styles['negativeActive'],
);

const NEGATIVE_INACTIVE_CLASS_NAME: string = validateString(
  styles['negativeInactive'],
);

const NEUTRAL_ACTIVE_CLASS_NAME: string = validateString(
  styles['neutralActive'],
);

const NEUTRAL_INACTIVE_CLASS_NAME: string = validateString(
  styles['neutralInactive'],
);

const POSITIVE_ACTIVE_CLASS_NAME: string = validateString(
  styles['positiveActive'],
);

const POSITIVE_INACTIVE_CLASS_NAME: string = validateString(
  styles['positiveInactive'],
);

const CLS_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 0.1,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 0.25,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const DCL_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 2600,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 5000,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const DOM_COMPLETE_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 2600,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 5000,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const FCP_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 1800,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 3000,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const FIP_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 100,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 300,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const INP_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 200,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 500,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const LCP_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 2500,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 4000,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const LOAD_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 5000,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 8200,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

const TTFB_THRESHOLDS: readonly Threshold[] = [
  // Good
  {
    activeClassName: POSITIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: POSITIVE_INACTIVE_CLASS_NAME,
    to: 800,
  },

  // Needs improvement
  {
    activeClassName: NEUTRAL_ACTIVE_CLASS_NAME,
    inactiveClassName: NEUTRAL_INACTIVE_CLASS_NAME,
    to: 1800,
  },

  // Poor
  {
    activeClassName: NEGATIVE_ACTIVE_CLASS_NAME,
    inactiveClassName: NEGATIVE_INACTIVE_CLASS_NAME,
  },
];

function DashboardWrapper({ children }: PropsWithChildren): ReactElement {
  return (
    <Section header={<I18n>quisi.do's dashboard</I18n>}>{children}</Section>
  );
}

function Dashboard(): ReactElement {
  const { data, error, initiated, loading, request } =
    useAsyncState<DashboardApiResponse>();

  useEffect((): void => {
    void request(async (): Promise<DashboardApiResponse> => {
      const response: Response = await window.fetch(DASHBOARD_ENDPOINT);
      const json: unknown = await response.json();
      if (!isDashboardApiResponse(json)) {
        throw new Error('Unknown response');
      }

      return json;
    });
  }, [request]);

  if (!initiated) {
    return <DashboardWrapper>Initializing</DashboardWrapper>;
  }

  if (loading) {
    return <DashboardWrapper>Loading</DashboardWrapper>;
  }

  if (typeof error !== 'undefined') {
    return (
      <DashboardWrapper>
        <Paragraph>
          <strong>An error occurred:</strong> {error}
        </Paragraph>
      </DashboardWrapper>
    );
  }

  const {
    cls: [, cls],
    dcl: [dcl],
    domComplete: [domComplete],
    errorCount: [errorCountP50, errorCountP75, errorCountP90],
    fcp: [, fcp],
    fip: [, fip],
    inp: [, inp],
    lcp: [, lcp],
    loadEvent: [loadEvent],
    loadingTime: [loadingTime],
    sessionTimeSpent,
    ttfb: [, ttfb],
    viewTimeSpent,
  } = data;
  return (
    <DashboardWrapper>
      <ul className={LIST_CLASS_NAME}>
        <li>
          <Paragraph>Cumulative layout shift p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            max={1}
            min={0}
            thresholds={CLS_THRESHOLDS}
            value={cls}
          />
          <Paragraph>
            <NumberFormat>{cls}</NumberFormat>
          </Paragraph>
        </li>
        <li>
          <Paragraph>DOM complete median:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={DOM_COMPLETE_THRESHOLDS}
            value={domComplete}
          />
          <Paragraph>
            <NumberFormat>{domComplete}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>DOM content loaded median:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={DCL_THRESHOLDS}
            value={dcl}
          />
          <Paragraph>
            <NumberFormat>{dcl}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>First contentful paint p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={FCP_THRESHOLDS}
            value={fcp}
          />
          <Paragraph>
            <NumberFormat>{fcp}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>First input delay p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={FIP_THRESHOLDS}
            value={fip}
          />
          <Paragraph>
            <NumberFormat>{fip}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Interaction to next paint p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={INP_THRESHOLDS}
            value={inp}
          />
          <Paragraph>
            <NumberFormat>{inp}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Largest contentful paint p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={LCP_THRESHOLDS}
            value={lcp}
          />
          <Paragraph>
            <NumberFormat>{lcp}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Load event median:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={LOAD_THRESHOLDS}
            value={loadEvent}
          />
          <Paragraph>
            <NumberFormat>{loadEvent}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Loading time p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={LOAD_THRESHOLDS}
            value={loadingTime}
          />
          <Paragraph>
            <NumberFormat>{loadingTime}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Time to first byte p75:</Paragraph>
          <Gauge
            className={GAUGE_CLASS_NAME}
            needleClassName={GAUGE_NEEDLE_CLASS_NAME}
            min={0}
            thresholds={TTFB_THRESHOLDS}
            value={ttfb}
          />
          <Paragraph>
            <NumberFormat>{ttfb}</NumberFormat>ms
          </Paragraph>
        </li>
        <li>
          <Paragraph>Error counts:</Paragraph>
          <ul>
            <li>
              Median: <NumberFormat>{errorCountP50}</NumberFormat>
            </li>
            <li>
              P75: <NumberFormat>{errorCountP75}</NumberFormat>
            </li>
            <li>
              P90: <NumberFormat>{errorCountP90}</NumberFormat>
            </li>
          </ul>
        </li>
        <li>
          <Paragraph>Time spent median:</Paragraph>
          <ul>
            <li>
              Session: <NumberFormat>{sessionTimeSpent}</NumberFormat>ms
            </li>
            <li>
              View: <NumberFormat>{viewTimeSpent}</NumberFormat>ms
            </li>
          </ul>
        </li>
      </ul>
      {/* <h3 style={{ margin: 0 }}>Scalability</h3>
      <ul>
        <li>Requests per second</li>
        <li>ROI, must be &ge; 1</li>
        <li>Availability</li>
        <li>Market funnel, $1 spent &ge; $1 earned</li>
      </ul>
      <h3 style={{ margin: 0 }}>Security</h3>
      <ul>
        <li>CSRF blocked</li>
        <li>Cloudflare DDoS + blocked IP counts</li>
        <li>AuthN/AuthZ error counts</li>
        <li>Anomaly detection on the above ratios</li>
      </ul> */}
    </DashboardWrapper>
  );
}

export default memo(Dashboard);
