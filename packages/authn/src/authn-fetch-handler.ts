import { ErrorCode } from '@quisido/authn-shared';
import { FetchHandler } from '@quisido/worker';
import { isR2Bucket, ResponseInitImpl } from 'cloudflare-utils';
import { isString } from 'fmrs';
import { EnvironmentName } from './constants/environment-name.js';
import { MetricName } from './constants/metric-name.js';
import type { OAuthProvider } from './constants/oauth-provider.js';
import {
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_SECOND,
} from './constants/time.js';
import createFatalOAuthErrorResponseInit from './fetch-handler/create-fatal-oauth-error-response-init.js';
import getAccessControlAllowOrigin from './fetch-handler/get-access-control-allow-origin.js';
import getIp from './fetch-handler/get-ip.js';
import getSessionIdCookie from './fetch-handler/get-session-id-cookie.js';
import handleFetchError from './fetch-handler/handle-fetch-error.js';
import handleFetchRequest from './fetch-handler/handle-fetch-request.js';
import mapEnvKeyToErrorCode from './fetch-handler/map-env-key-to-error-code.js';
import FatalError from './utils/fatal-error.js';
import isEnvironmentName from './utils/is-environment-name.js';
import isNonEmptyString from './utils/is-non-empty-string.js';
import TemporaryMap from './utils/temporary-map.js';
import Throttler from './utils/throttler.js';

const OAUTH_IP_THROTTLE_LIMIT = 10000;
const WHOAMI_IP_THROTTLE_LIMIT = 1000;

export default class AuthnFetchHandler extends FetchHandler {
  static #AUTHN_USER_ID_MAP = new TemporaryMap<number>();
  static #OAUTH_IP_THROTTLER = new Throttler();
  static #WHOAMI_IP_THROTTLER = new Throttler();

  public constructor() {
    super(handleFetchRequest, handleFetchError);
  }

  public get accessControlAllowOrigin(): string {
    return getAccessControlAllowOrigin.call(this);
  }

  public get analyticsId(): string {
    return this.validateEnv('ANALYTICS_ID', isString);
  }

  public get analyticsSecret(): string {
    return this.validateEnv('ANALYTICS_SECRET', isString);
  }

  public get authnIdCookie(): string | undefined {
    return this.getCookie('__Secure-Authentication-ID');
  }

  public get authnUserIdsNamespace(): KVNamespace {
    return this.getKVNamespace('AUTHN_USER_IDS');
  }

  public get cookieDomain(): string {
    return this.validateEnv('COOKIE_DOMAIN', isNonEmptyString, 'quisi.do');
  }

  public get dataBucket(): R2Bucket | null {
    return this.validateEnv('AUTHN_DATA', isR2Bucket, null);
  }

  public get database(): D1Database {
    return this.getD1Database('AUTHN_DB');
  }

  public emitPrivateMetric = (
    name: MetricName,
    dimensions?: Record<number | string | symbol, boolean | number | string>,
  ): void => {
    this.emitMetric(name, {
      ...dimensions,
      [Symbol('Public')]: false,
    });
  };

  public emitPublicMetric = (
    name: MetricName,
    dimensions?: Record<number | string | symbol, boolean | number | string>,
  ): void => {
    this.emitMetric(name, {
      ...dimensions,
      [Symbol('Public')]: true,
    });
  };

  public get environmentName(): EnvironmentName {
    return this.validateEnv(
      'ENVIRONMENT_NAME',
      isEnvironmentName,
      EnvironmentName.Unknown,
    );
  }

  public get FatalOAuthErrorResponse(): new (
    code: ErrorCode,
    returnPath?: string,
  ) => Response {
    const { FatalOAuthErrorResponseInit } = this;
    return class FatalOAuthErrorResponse extends Response {
      public constructor(code: ErrorCode, returnPath?: string) {
        super(null, new FatalOAuthErrorResponseInit(code, returnPath));
      }
    };
  }

  public get FatalOAuthErrorResponseInit(): new (
    code: ErrorCode,
    returnPath?: string,
  ) => ResponseInit {
    const { host } = this;
    return class ErrorResponseInit extends ResponseInitImpl {
      public constructor(code: ErrorCode, returnPath = '/') {
        super(createFatalOAuthErrorResponseInit({ code, host, returnPath }));
      }
    };
  }

  public getAuthnUserIdFromMemory = (authnId: string): number | undefined => {
    return AuthnFetchHandler.#AUTHN_USER_ID_MAP.get(authnId, {
      now: this.now.bind(this),
    });
  };

  public get host(): string {
    return this.validateEnv('HOST', isNonEmptyString, 'quisi.do');
  }

  public get ip(): string {
    return getIp.call(this);
  }

  public nowSeconds = (): number =>
    Math.floor(this.now() / MILLISECONDS_PER_SECOND);

  public get patreonOAuthClientId(): string {
    return this.validateEnv('PATREON_OAUTH_CLIENT_ID', isString);
  }

  public get patreonOAuthClientSecret(): string {
    return this.validateEnv('PATREON_OAUTH_CLIENT_SECRET', isString);
  }

  public get patreonOAuthHost(): string {
    return this.validateEnv('PATREON_OAUTH_HOST', isString);
  }

  public get patreonOAuthRedirectUri(): string {
    return this.validateEnv('PATREON_OAUTH_REDIRECT_URI', isString);
  }

  public get sessionIdCookie(): string {
    return getSessionIdCookie.call(this);
  }

  public setAuthnUserIdInMemory = (authnId: string, userId: number): void => {
    AuthnFetchHandler.#AUTHN_USER_ID_MAP.set(
      authnId,
      userId,
      MILLISECONDS_PER_DAY,
      {
        now: this.now.bind(this),
      },
    );
  };

  public throttleOAuthByIp = (ip: string): boolean => {
    return AuthnFetchHandler.#OAUTH_IP_THROTTLER.run(
      ip,
      OAUTH_IP_THROTTLE_LIMIT,
      {
        now: this.now.bind(this),
      },
    );
  };

  public throttleWhoAmIByIp = (ip: string): boolean => {
    return AuthnFetchHandler.#WHOAMI_IP_THROTTLER.run(
      ip,
      WHOAMI_IP_THROTTLE_LIMIT,
      {
        now: this.now.bind(this),
      },
    );
  };

  public override validateEnv = <T>(
    key: string,
    isValid: (value: unknown) => value is T,
    defaultValue?: T,
  ): T => {
    try {
      return super.validateEnv(key, isValid, defaultValue);
    } catch (_err: unknown) {
      const code: ErrorCode = mapEnvKeyToErrorCode(key);
      throw new FatalError(code);
    }
  };

  public writeOAuthResponse = (
    provider: OAuthProvider,
    id: string,
    response: unknown,
  ): void => {
    const { dataBucket } = this;
    if (dataBucket === null) {
      return;
    }

    this.affect(
      dataBucket.put(
        `provider-${provider.toString()}/${id}.json`,
        JSON.stringify(response),
        {
          customMetadata: {
            timestamp: this.now().toString(),
          },
          httpMetadata: {
            contentType: 'application/json',
          },
        },
      ),
    );
  };
}
