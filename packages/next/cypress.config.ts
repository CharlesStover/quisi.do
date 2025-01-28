/// <reference types="cypress" />
/// <reference types="./src/types/dd-trace.d.ts" />
import coverage from '@monorepo-template/cypress-coverage-plugin';
import datadogTracer from 'dd-trace/ci/cypress/plugin';
import getScreenshotsFolder from './src/test/utils/get-cypress-screenshots-folder.js';

export default {
  defaultCommandTimeout: 30000,
  experimentalInteractiveRunEvents: true,
  // ExperimentalMemoryManagement: true,
  // ExperimentalModifyObstructiveThirdPartyCode: true,
  // ExperimentalSourceRewriting: true,
  // ExperimentalWebKitSupport: true,
  fixturesFolder: false,
  projectId: 'kqcybg',
  redirectionLimit: 2,
  screenshotsFolder: getScreenshotsFolder(),

  e2e: {
    baseUrl: 'https://localhost:3000/',
    // ExperimentalOriginDependencies: true,
    experimentalRunAllSpecs: true,
    // ExperimentalStudio: true,
    specPattern: 'src/**/*.e2e.ts',

    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ): Cypress.PluginConfigOptions {
      coverage(on, config);
      datadogTracer(on, config);
      return config;
    },
  },

  env: {
    codeCoverageTasksRegistered: true,
  },

  retries: {
    openMode: 0,
    runMode: 2,
  },
} satisfies Cypress.ConfigOptions;
