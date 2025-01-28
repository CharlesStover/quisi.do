import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';

export function UnknownErrorMessage(): ReactElement {
  return <I18n>An unknown error occurred.</I18n>;
}
