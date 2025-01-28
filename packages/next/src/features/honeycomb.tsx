import type { PropsWithChildren, ReactElement } from 'react';
import Honeycomb from '../components/honeycomb.jsx';
import validateString from '../utils/validate-string.js';

const HONEYCOMB_API_KEY: string = validateString(
  process.env['HONEYCOMB_API_KEY'],
);

export default function HoneycombFeature({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <Honeycomb apiKey={HONEYCOMB_API_KEY} serviceName="quisi.do">
      {children}
    </Honeycomb>
  );
}
