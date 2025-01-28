import { ErrorCode, WhoAmIResponseCode } from '@quisido/authn-shared';
import { StatusCode } from 'cloudflare-utils';
import { mapToError } from 'fmrs';
import type AuthnFetchHandler from '../authn-fetch-handler.js';
import { MetricName } from '../constants/metric-name.js';
import FatalError from '../utils/fatal-error.js';
import WhoAmIResponseInit from './whoami-response-init.js';
import WhoAmIResponse from './whoami-response.js';

const BASE = 10;

export default async function handleWhoAmIFetchRequest(
  this: AuthnFetchHandler,
): Promise<Response> {
  // Options
  if (this.requestMethod === 'OPTIONS') {
    return new Response(
      null,
      new WhoAmIResponseInit(StatusCode.OK, {
        accessControlAllowOrigin: this.accessControlAllowOrigin,
      }),
    );
  }

  // If the user is not authenticated,
  if (typeof this.authnIdCookie === 'undefined') {
    this.emitPublicMetric(MetricName.MissingAuthnId);
    return new WhoAmIResponse({
      accessControlAllowOrigin: this.accessControlAllowOrigin,
      code: WhoAmIResponseCode.MissingAuthnId,
    });
  }

  // If the authentication ID is cached in memory,
  const userIdFromMemory: number | undefined = this.getAuthnUserIdFromMemory(
    this.authnIdCookie,
  );

  if (typeof userIdFromMemory !== 'undefined') {
    this.emitPublicMetric(MetricName.CachedAuthnId);
    this.emitPrivateMetric(MetricName.CachedAuthnId, {
      userId: userIdFromMemory,
    });

    return new WhoAmIResponse({
      accessControlAllowOrigin: this.accessControlAllowOrigin,
      code: WhoAmIResponseCode.Cached,
      id: userIdFromMemory,
    });
  }

  // Throttle
  if (this.shouldThrottleWhoAmIByIp()) {
    this.emitPublicMetric(MetricName.WhoAmIThrottled);
    this.emitPrivateMetric(MetricName.WhoAmIThrottled, {
      ip: this.ip,
    });

    return new WhoAmIResponse({
      accessControlAllowOrigin: this.accessControlAllowOrigin,
      code: WhoAmIResponseCode.Throttled,
      status: StatusCode.TooManyRequests,
    });
  }

  try {
    const userIdStr: string | null = await this.getKVNamespaceText(
      'AUTHN_USER_IDS',
      this.authnIdCookie,
    );

    /**
     *   Authentication is eventually consistent. We don't want to delete the
     * invalid authentication cookie in case the ID exists in the future.
     */
    if (userIdStr === null) {
      this.emitPublicMetric(MetricName.InvalidAuthnId);
      this.emitPrivateMetric(MetricName.InvalidAuthnId, {
        authnId: this.authnIdCookie,
      });

      return new WhoAmIResponse({
        accessControlAllowOrigin: this.accessControlAllowOrigin,
        code: WhoAmIResponseCode.InvalidAuthnId,
      });
    }

    // User found! 🎉
    const userId: number = parseInt(userIdStr, BASE);
    this.setAuthnUserIdInMemory(this.authnIdCookie, userId);

    this.emitPublicMetric(MetricName.UncachedAuthnId);
    this.emitPrivateMetric(MetricName.UncachedAuthnId, {
      userId,
    });

    return new WhoAmIResponse({
      accessControlAllowOrigin: this.accessControlAllowOrigin,
      code: WhoAmIResponseCode.Uncached,
      id: userId,
    });
  } catch (err: unknown) {
    if (err instanceof FatalError) {
      this.logError(err);
      return new Response(
        JSON.stringify({
          error: err.cause,
        }),

        new WhoAmIResponseInit(StatusCode.InternalServerError, {
          accessControlAllowOrigin: this.accessControlAllowOrigin,
        }),
      );
    }

    const error: Error = mapToError(err);
    this.logError(error);
    return new Response(
      JSON.stringify({
        error: ErrorCode.Unknown,
      }),

      new WhoAmIResponseInit(StatusCode.InternalServerError, {
        accessControlAllowOrigin: this.accessControlAllowOrigin,
      }),
    );
  }
}
