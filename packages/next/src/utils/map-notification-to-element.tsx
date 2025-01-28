import type { ReactElement } from 'react';
import LazyNotification from '../components/lazy-notification.jsx';
import Notification from '../components/notification.jsx';
import type NotificationType from '../types/notification.js';
import type { WithKey } from '../types/with-key.js';

export default function mapNotificationToElement(
  notification: Promise<WithKey<NotificationType>> | WithKey<NotificationType>,
): ReactElement {
  if (notification instanceof Promise) {
    return <LazyNotification>{notification}</LazyNotification>;
  }

  return <Notification {...notification} />;
}
