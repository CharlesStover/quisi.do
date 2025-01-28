/// <reference types="@types/google.visualization" />

import HTMLScriptElementLoadPromise from './html-script-element-load-promise.js';

/**
 *   If you think it sounds funny to "load the loader," then see the official
 * docs: https://developers.google.com/chart/interactive/docs/basic_load_libs
 */

const LOADER_SRC = 'https://www.gstatic.com/charts/loader.js';

const createLoaderScript = (): HTMLScriptElement => {
  const script: HTMLScriptElement = window.document.createElement('script');
  script.setAttribute('async', 'true');
  script.setAttribute('src', LOADER_SRC);
  script.setAttribute('type', 'text/javascript');
  return script;
};

const isLoaderScript = (script: HTMLScriptElement): boolean =>
  script.getAttribute('src') === LOADER_SRC;

export default function loadGoogleChartsLoader(): Promise<typeof google> {
  if ('google' in (window as Partial<Window>)) {
    return Promise.resolve(window.google);
  }

  const validateGoogleCharts = (): typeof google => {
    if ('google' in (window as Partial<Window>)) {
      return window.google;
    }

    throw new Error('Google Charts failed to load.');
  };

  for (const script of window.document.scripts) {
    if (!isLoaderScript(script)) {
      continue;
    }

    return new HTMLScriptElementLoadPromise(script).then(validateGoogleCharts);
  }

  const script: HTMLScriptElement = createLoaderScript();
  const promise = new HTMLScriptElementLoadPromise(script);
  window.document.body.appendChild(script);
  return promise.then(validateGoogleCharts);
}
