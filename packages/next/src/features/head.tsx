import type { ReactElement } from 'react';
import CloudflareInsights from '../components/cloudflare-insights.js';
import NetworkErrorLogging from '../components/network-error-logging.jsx';
import RocketLoaderHotfix from '../components/rocket-loader-hotfix.jsx';
import GoogleFonts from '../features/google-fonts.js';
import Preconnect from '../features/preconnect.js';
import Clarity from '../modules/react-clarity/index.jsx';
import validateString from '../utils/validate-string.js';

const CLARITY_TAG: string = validateString(process.env['CLARITY_TAG']);
const isProduction: boolean = process.env.NODE_ENV === 'production';

export default function Head(): ReactElement {
  return (
    <head>
      {/**
       *   The Rocket Loader hotfix loads synchronously, so it must appear
       * before the Rocket Loader script. By loading it immediately, it also
       * appears before any other scripts that may add unload event listeners.
       */}
      <RocketLoaderHotfix />
      {/* <ContentSecurityPolicy /> */}
      <Clarity tag={CLARITY_TAG} />
      {isProduction && (
        <CloudflareInsights token="f9703ac5039848f8abd3ab107a208a83" />
      )}
      <GoogleFonts />
      <meta charSet="utf-8" />
      <NetworkErrorLogging
        includeSubdomains
        maxAge={31536000}
        reportTo="quisido"
      />
      <Preconnect />
      {/* <Traceparent /> */}
    </head>
  );
}
