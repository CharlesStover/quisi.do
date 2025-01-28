'use client';

import { memo, type ReactElement } from 'react';
import { useNotifications } from '../contexts/notifications.js';
import mapNotificationToElement from '../utils/map-notification-to-element.jsx';
import validateString from '../utils/validate-string.js';
import styles from './notifications.module.scss';

const CLASS_NAME: string = validateString(styles['notifications']);

function Notifications(): ReactElement {
  // Context
  const [notifications] = useNotifications();

  return (
    <div className={CLASS_NAME}>
      {notifications.map(mapNotificationToElement)}
    </div>
  );
}

export default memo(Notifications);
