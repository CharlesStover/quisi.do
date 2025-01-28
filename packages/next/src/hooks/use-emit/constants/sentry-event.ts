import sentryBrowserPackage from '@sentry/browser/package.json';
import { type Event } from '@sentry/core';
import sentryCorePackage from '@sentry/core/package.json';
import sentryReactPackage1 from '@sentry/react/package.json';
import sentryTracingPackage from '@sentry/tracing/package.json';
import sentryTypesPackage from '@sentry/types/package.json';
import reactDomPackage from 'react-dom/package.json';
import reactPackage from 'react/package.json';
// Import sentryReactPackage2 from 'sentry-react/package.json';
import VERSION from '../../../constants/version.js';

const APP_START_TIME: string = new Date().toUTCString();
const START_TIMESTAMP: number = Date.now();

export default {
  dist: process.env.NODE_ENV,
  environment: process.env.NODE_ENV,
  level: 'log',
  logger: 'useEvent',
  platform: 'javascript',
  release: `quisi.do@${VERSION}`,
  start_timestamp: START_TIMESTAMP,
  type: 'transaction',

  contexts: {
    app: {
      app_build: VERSION,
      app_identifier: 'quisi.do',
      app_name: 'quisi.do',
      app_start_time: APP_START_TIME,
      app_version: VERSION,
      build_type: process.env.NODE_ENV,
    },

    culture: {
      /*
       * Calendar?: string;
       * display_name?: string;
       * is_24_hour_format?: boolean;
       * locale?: string;
       * timezone?: string;
       */
    },

    device: {
      /*
       * Arch?: string;
       * battery_level?: number;
       * battery_status?: string;
       * boot_time?: string;
       * brand?: string;
       * charging?: boolean;
       * cpu_description?: string;
       * device_type?: string;
       * device_unique_identifier?: string;
       * external_free_storage?: number;
       * external_storage_size?: number;
       * family?: string;
       * free_memory?: number;
       * free_storage?: number;
       * low_memory?: boolean;
       * manufacturer?: string;
       * memory_size?: number;
       * model?: string;
       * model_id?: string;
       * name: window.navigator.userAgent, // window isn't defined until runtime
       * online?: boolean;
       * orientation?: 'portrait' | 'landscape';
       * processor_count?: number;
       * processor_frequency?: number;
       * screen_density?: number;
       * screen_dpi?: number;
       * screen_height_pixels?: number;
       * screen_resolution?: string;
       * screen_width_pixels?: number;
       * simulator?: boolean;
       * storage_size?: number;
       * supports_accelerometer?: boolean;
       * supports_audio?: boolean;
       * supports_gyroscope?: boolean;
       * supports_location_service?: boolean;
       * supports_vibration?: boolean;
       * usable_memory?: number;
       */
    },

    os: {
      /*
       * Build?: string;
       * kernel_version?: string;
       * name?: string;
       * version?: string;
       */
    },
  },

  modules: {
    '@sentry/browser': sentryBrowserPackage.version,
    '@sentry/core': sentryCorePackage.version,
    '@sentry/react': sentryReactPackage1.version,
    '@sentry/tracing': sentryTracingPackage.version,
    '@sentry/types': sentryTypesPackage.version,
    react: reactPackage.version,
    'react-dom': reactDomPackage.version,
    // 'sentry-react': sentryReactPackage2.version,
  },

  transaction_info: {
    source: 'route',
  },
} satisfies Event;
