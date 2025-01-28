import { ErrorCode } from '@quisido/authn-shared';
import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import AlarmExistsMessage from '../components/alarm-exists-message.jsx';
import CsrfLink from '../components/csrf-link.jsx';
import MisconfiguredPatreonClientMessage from '../components/misconfigured-patreon-client-message.jsx';
import { UnknownErrorMessage } from '../components/unknown-error-message.jsx';
import type Notification from '../types/notification.js';

export default function mapAuthnErrorCodeToNotification(
  code: ErrorCode,
): Pick<Notification, 'Header' | 'Message'> {
  switch (code) {
    case ErrorCode.CSRF:
      return {
        Header(): ReactElement {
          return <I18n>Cross-site request forgery</I18n>;
        },

        Message(): ReactElement {
          return (
            <I18n>
              The authentication attempt could not be trusted and was rejected.
            </I18n>
          );
        },
      };

    case ErrorCode.InvalidAuthnUserIdsNamespace:
      return {
        Header(): ReactElement {
          return <I18n>Invalid namespace</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>
                Your session cannot currently be paired with your account.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidCause:
    case ErrorCode.Unknown:
    case ErrorCode.UnknownCause:
      return {
        Message(): ReactElement {
          return (
            <>
              <UnknownErrorMessage />
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidDatabase:
      return {
        Header(): ReactElement {
          return <I18n>Invalid database</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Your account information cannot currently be read.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidIsolateEnvironment:
      return {
        Header(): ReactElement {
          return <I18n>Invalid isolate environment</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>The authentication service is offline.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidPatreonClientId:
      return {
        Header(): ReactElement {
          return <I18n>Invalid client ID</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Patreon rejected the authentication attempt.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidPatreonGrantCode:
      return {
        Header(): ReactElement {
          return <I18n>Invalid grant code</I18n>;
        },

        Message(): ReactElement {
          return <I18n>Patreon rejected the authentication attempt.</I18n>;
        },
      };

    case ErrorCode.InvalidPatreonIdentityData:
      return {
        Header(): ReactElement {
          return <I18n>Invalid identity data</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>
                We were unable to view your Patreon account information.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.InvalidPatreonOAuthClientId:
      return {
        Message: MisconfiguredPatreonClientMessage,

        Header(): ReactElement {
          return <I18n>Invalid client ID</I18n>;
        },
      };

    case ErrorCode.InvalidPatreonOAuthClientSecret:
      return {
        Message: MisconfiguredPatreonClientMessage,

        Header(): ReactElement {
          return <I18n>Invalid client secret</I18n>;
        },
      };

    case ErrorCode.InvalidPatreonOAuthHost:
      return {
        Message: MisconfiguredPatreonClientMessage,

        Header(): ReactElement {
          return <I18n>Invalid host</I18n>;
        },
      };

    case ErrorCode.InvalidPatreonOAuthRedirectUri:
      return {
        Message: MisconfiguredPatreonClientMessage,

        Header(): ReactElement {
          return <I18n>Invalid redirect URI</I18n>;
        },
      };

    case ErrorCode.InvalidUsageDataset:
      return {
        Header(): ReactElement {
          return <I18n>Invalid dataset</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Application usage cannot currently be tracked.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingAuthnUserIdsNamespace:
      return {
        Header(): ReactElement {
          return <I18n>Missing namespace</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>
                Your session cannot currently be paired with your account.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingCookies:
      return {
        Message(): ReactElement {
          return <I18n>You must enable cookies to authenticate.</I18n>;
        },
      };

    case ErrorCode.MissingDatabase:
      return {
        Header(): ReactElement {
          return <I18n>Missing database</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Your account information cannot currently be read.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingIsolateEnvironment:
      return {
        Header(): ReactElement {
          return <I18n>Missing isolate environment</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>The authentication service is offline.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingPatreonAccessToken:
      return {
        Header(): ReactElement {
          return <I18n>Missing access token</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Patreon did not provide an access token.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingPatreonIdentityData:
      return {
        Header(): ReactElement {
          return <I18n>Missing identity data</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>
                We were unable to view your Patreon account information.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingPatreonIdentityId:
      return {
        Header(): ReactElement {
          return <I18n>Missing ID</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>Patreon did not provide your ID.</I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingPatreonOAuthClientSecret:
      return {
        Message: MisconfiguredPatreonClientMessage,

        Header(): ReactElement {
          return <I18n>Missing client secret</I18n>;
        },
      };

    case ErrorCode.MissingPatreonRequestCode:
      return {
        Header(): ReactElement {
          return <I18n>Missing code</I18n>;
        },

        Message(): ReactElement {
          return <I18n>Your authentication request lacked a code.</I18n>;
        },
      };

    case ErrorCode.MissingPatreonTokenErrorResponseBody:
    case ErrorCode.MissingPatreonTokenErrorResponseCode:
      return {
        Header: UnknownErrorMessage,

        Message(): ReactElement {
          return (
            <>
              <I18n>
                Patreon refused to issue an access token, but did not disclose
                why.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };

    case ErrorCode.MissingSessionIdCookie:
      return {
        Header(): ReactElement {
          return <I18n>Missing session ID cookie</I18n>;
        },

        Message(): ReactElement {
          return (
            <I18n
              csrf={
                <CsrfLink feature="authn-error-code/messing-session-id-cookie" />
              }
            >
              Ensure cookies are enabled. To prevent $csrf, authentication
              requires visiting this website first.
            </I18n>
          );
        },
      };

    case ErrorCode.MissingStateSessionId:
      return {
        Header(): ReactElement {
          return <I18n>Missing state</I18n>;
        },

        Message(): ReactElement {
          return (
            <I18n
              csrf={
                <CsrfLink feature="authn-error-code/missing-state-session-id" />
              }
            >
              To prevent $csrf, authentication must originate from this website.
            </I18n>
          );
        },
      };

    case ErrorCode.NonObjectState:
      return {
        Header(): ReactElement {
          return <I18n>Invalid state</I18n>;
        },

        Message(): ReactElement {
          return (
            <I18n
              csrf={<CsrfLink feature="authn-error-code/non-object-state" />}
            >
              To prevent $csrf, authentication must originate from this website.
            </I18n>
          );
        },
      };

    case ErrorCode.InvalidPatreonTokenErrorResponse:
    case ErrorCode.InvalidPatreonTokenErrorResponseBody:
      return {
        Header(): ReactElement {
          return <I18n>Invalid response</I18n>;
        },

        Message(): ReactElement {
          return (
            <>
              <I18n>
                Patreon refused to issue an access token, but did not disclose
                why.
              </I18n>
              <AlarmExistsMessage />
            </>
          );
        },
      };
    case ErrorCode.NotFound:
      return {
        Header(): ReactElement {
          return <I18n>Not found</I18n>;
        },

        Message(): ReactElement {
          return <I18n>The URL you requested does not exist.</I18n>;
        },
      };

    case ErrorCode.TooManyRequests:
      return {
        Header(): ReactElement {
          return <I18n>Too many requests</I18n>;
        },

        Message(): ReactElement {
          return <I18n>Your authentication attempt was throttled.</I18n>;
        },
      };

    default:
      return {
        Message: UnknownErrorMessage,
      };
  }
}
