import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';

export default function AlarmExistsMessage(): ReactElement {
  return <I18n>The team has been notified. Please try again later.</I18n>;
}
