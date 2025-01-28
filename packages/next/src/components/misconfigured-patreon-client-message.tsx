import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import AlarmExistsMessage from './alarm-exists-message.jsx';

export default function MisconfiguredPatreonClientMessage(): ReactElement {
  return (
    <>
      <I18n>Our Patreon client is misconfigured.</I18n>
      <AlarmExistsMessage />
    </>
  );
}
