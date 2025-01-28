'use client';

import { identity } from 'fmrs';
import { memo, useEffect } from 'react';
import { GITHUB_SHA } from '../constants/github-sha.js';
import useLogRocket from '../hooks/use-log-rocket.js';
import {
  type LogRocketOptions,
  type LogRocketRequest,
  type LogRocketResponse,
} from '../types/log-rocket.js';
import getHostname from '../utils/get-hostname.js';

export interface User extends Record<string, number | string> {
  readonly id: string;
}

export interface Props {
  readonly appId: string;
  readonly user?: User | undefined;

  readonly sanitizeRequest?:
    | ((request: LogRocketRequest) => LogRocketRequest | null)
    | undefined;

  readonly sanitizeResponse?:
    | ((
        request: LogRocketRequest | undefined,
        response: LogRocketResponse,
      ) => LogRocketResponse | null)
    | undefined;
}

const BROWSER: Required<Required<LogRocketOptions>['browser']> = {
  urlSanitizer(): string | null {
    return null;
  },
};

const CONSOLE_IS_ENABLED: Required<
  Required<Required<LogRocketOptions>['console']>['isEnabled']
> = {
  debug: false,
  error: true,
  info: true,
  log: true,
  warn: true,
};

const CONSOLE: Required<Required<LogRocketOptions>['console']> = {
  isEnabled: CONSOLE_IS_ENABLED,
  shouldAggregateConsoleErrors: true,
};

const DOM: Required<Omit<Required<LogRocketOptions>['dom'], 'baseHref'>> = {
  disablePageTitles: false,
  disableWebAnimations: false,
  hiddenAttributes: [],
  inputSanitizer: false,
  isEnabled: true,
  privateAttributeBlocklist: [],
  privateClassNameBlocklist: [],
  textSanitizer: false,
};

const NETWORK_REQUESTS = new Map<string, LogRocketRequest>();

const OPTIONS: Required<
  Omit<
    LogRocketOptions,
    | 'network'
    | 'rootHostname'
    | 'serverURL'
    | 'shouldSendData'
    | 'uploadTimeInterval'
  >
> = {
  browser: BROWSER,
  childDomains: [],
  console: CONSOLE,
  disableBusyFramesTracker: false,
  dom: DOM,
  mergeIframes: true,
  parentDomain: null,
  release: GITHUB_SHA ?? 'dev',
  shouldAugmentNPS: true,
  shouldCaptureIP: true,
  shouldDebugLog: false,
  shouldDetectExceptions: true,
  shouldParseXHRBlob: true,
};

const defaultResponseSanitizer = (
  _request: LogRocketRequest | undefined,
  response: LogRocketResponse,
): LogRocketResponse => response;

function LogRocket({
  appId,
  sanitizeRequest = identity,
  sanitizeResponse = defaultResponseSanitizer,
  user,
}: Props): null {
  const LogRocket = useLogRocket();

  useEffect((): void => {
    LogRocket.init(appId, {
      ...OPTIONS,
      rootHostname: getHostname(),

      dom: {
        ...OPTIONS.dom,
        baseHref: `${window.location.origin}/`,
      },

      network: {
        isEnabled: true,

        requestSanitizer(request: LogRocketRequest): LogRocketRequest | null {
          NETWORK_REQUESTS.set(request.reqId, request);
          return sanitizeRequest(request);
        },

        responseSanitizer(
          response: LogRocketResponse,
        ): LogRocketResponse | null {
          const request: LogRocketRequest | undefined = NETWORK_REQUESTS.get(
            response.reqId,
          );
          return sanitizeResponse(request, response);
        },
      },
    });
  }, [appId, LogRocket, sanitizeRequest, sanitizeResponse]);

  useEffect((): void => {
    if (typeof user === 'undefined') {
      return;
    }

    const { id, ...traits } = user;
    LogRocket.identify(id, traits);
  }, [LogRocket, user]);

  return null;
}

export default memo(LogRocket);
