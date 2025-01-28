import { memo, type ReactElement, type ReactNode } from 'react';
import Sentry from '../components/sentry.jsx';
import { GITHUB_SHA } from '../constants/github-sha.js';
import validateString from '../utils/validate-string.js';

interface Props {
  readonly children: ReactNode;
}

const ENVIRONMENT: string = validateString(process.env['SENTRY_ENVIRONMENT']);
const RELEASE: string = GITHUB_SHA ?? 'unknown';
const TRACE_PROPAGATION_TARGETS: string[] = [
  'api.quisi.do',
  'localhost',
  'quisi.do',
];

function SentryFeature({ children }: Props): ReactElement {
  return (
    <Sentry
      dsn="https://a36b53fdd093405eb597a945f49a70f2@o592283.ingest.sentry.io/5740642"
      environment={ENVIRONMENT}
      org="quisido"
      release={RELEASE}
      tracePropagationTargets={TRACE_PROPAGATION_TARGETS}
    >
      {children}
    </Sentry>
  );
}

export default memo(SentryFeature);
