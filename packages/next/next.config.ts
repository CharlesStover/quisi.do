import { type NextConfig } from 'next';
import { type ExperimentalConfig } from 'next/dist/server/config-shared.js';
import getCpus from './src/utils/get-cpus.js';
import getVersion from './src/utils/get-version.js';
import mapEnvironmentVariableNamesToRecord from './src/utils/map-environment-variable-names-to-record.js';
import mapNodeEnvToOnDemandEntries from './src/utils/map-node-env-to-on-demand-entries.js';
import mapNodeEnvToOutput from './src/utils/map-node-env-to-output.js';
import optional from './src/utils/optional.js';
import withNextJsBundleAnalyzer from './src/utils/with-nextjs-bundle-analyzer.js';

const cpus: number = getCpus();
const handleDemandEntries = mapNodeEnvToOnDemandEntries(process.env.NODE_ENV);

const OUTPUT: Required<NextConfig>['output'] = mapNodeEnvToOutput(
  process.env.NODE_ENV,
);

export default withNextJsBundleAnalyzer({
  assetPrefix: '',
  basePath: '',
  compress: true,
  distDir: '.next',
  generateBuildId: getVersion,
  ...optional('onDemandEntries', handleDemandEntries),
  output: OUTPUT,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  skipTrailingSlashRedirect: false,
  staticPageGenerationTimeout: 600,
  trailingSlash: true,

  devIndicators: {
    appIsrStatus: false,
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  env: mapEnvironmentVariableNamesToRecord([
    'CLARITY_TAG',
    'CLOUD_ACCOUNT_ID',
    'CLOUD_PLATFORM',
    'CLOUD_PROVIDER',
    'CLOUDWATCH_RUM_APPLICATION_ID',
    'CLOUDWATCH_RUM_GUEST_ROLE_ARN',
    'CLOUDWATCH_RUM_IDENTITY_POOL_ID',
    'CSP_ORIGIN',
    'DASHBOARD_ENDPOINT',
    'DD_APPLICATION_ID',
    'DD_CLIENT_TOKEN',
    'DEPLOYMENT_ENVIRONMENT',
    'GOOGLE_ANALYTICS_TRACKING_ID',
    'HONEYCOMB_API_KEY',
    'PATREON_OAUTH_CLIENT_ID',
    'PATREON_OAUTH_REDIRECT_URI',
    'SENTRY_ENVIRONMENT',
    'WHOAMI',
  ]),

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    cpus,
    fullySpecified: true,
    memoryBasedWorkersCount: true,
    nextScriptWorkers: true,
    optimizeCss: true,
    optimizeServerReact: true,
    ppr: OUTPUT !== 'export',
    reactCompiler: true,
    serverMinification: true,
    serverSourceMaps: true,
    staticGenerationMaxConcurrency: cpus,
    staticGenerationRetryCount: 3,
    strictNextHead: true,
    swcTraceProfiling: true,
    taint: true,
    useEarlyImport: true,
    useWasmBinary: true,
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
    webpackMemoryOptimizations: false,

    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    },

    sri: {
      algorithm: 'sha512',
    },

    // Error: Jest worker encountered 1 child process exceptions, exceeding retry limit
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
    webpackBuildWorker: false,

    // DOMException [DataCloneError]: ... could not be cloned.
    workerThreads: false,
  } satisfies ExperimentalConfig,

  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },

  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.prepack.json',
  },
} satisfies NextConfig) satisfies NextConfig;
