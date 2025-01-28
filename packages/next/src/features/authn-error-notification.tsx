import { type ErrorCode } from '@quisido/authn-shared';
import { type ComponentType, type ReactElement } from 'react';
import { UnknownErrorMessage } from '../components/unknown-error-message.jsx';
import { type NoActionNotification } from '../types/notification.js';
import mapAuthnErrorCodeToNotification from '../utils/map-authn-error-code-to-notification.jsx';
import mapHashToAuthnErrorCode from '../utils/map-hash-to-authn-error-code';
import AuthnErrorsTranslationsProvider from './authn-errors-translations-provider.jsx';

export default class AuthnErrorNotification implements NoActionNotification {
  public readonly icon = '⚠️';

  readonly #Header: ComponentType | undefined;

  readonly #Message: ComponentType;

  public readonly type = 'error';

  public constructor(code: ErrorCode | null) {
    /**
     *   This should only happen if the user manually entered an invalid error
     * code into their address bar.
     */
    if (code === null) {
      this.#Message = UnknownErrorMessage;
    } else {
      const { Header, Message } = mapAuthnErrorCodeToNotification(code);
      this.#Message = Message;
      if (typeof Header !== 'undefined') {
        this.#Header = Header;
      }
    }
  }

  public get Header(): ComponentType | undefined {
    const Component: ComponentType | undefined = this.#Header;
    if (typeof Component === 'undefined') {
      return;
    }

    return function HeaderImpl(): ReactElement {
      return (
        <AuthnErrorsTranslationsProvider>
          <Component />
        </AuthnErrorsTranslationsProvider>
      );
    };
  }

  public Message(): ReactElement {
    const Component: ComponentType = this.#Message;
    return (
      <AuthnErrorsTranslationsProvider>
        <Component />
      </AuthnErrorsTranslationsProvider>
    );
  }

  public static fromHash(hash: string): AuthnErrorNotification {
    const code: ErrorCode | null = mapHashToAuthnErrorCode(hash);
    return new AuthnErrorNotification(code);
  }
}
