'use client';

import I18n from 'lazy-i18n';
import { useEffect, useState, type ReactElement, type RefObject } from 'react';
import useMountedRef from '../hooks/use-mounted-ref.js';
import type NotificationType from '../types/notification.js';
import mapErrorToNotification from '../utils/map-error-to-notification.js';
import Notification from './notification.jsx';

interface LazyNotificationProps {
  readonly children: Promise<NotificationType>;
}

const LOADING_NOTIFICATION: NotificationType = {
  icon: '⏳',
  type: 'info',

  Message(): ReactElement {
    return <I18n>Loading</I18n>;
  },
};

export default function LazyNotification({
  children,
}: LazyNotificationProps): ReactElement {
  // States
  const isMountedRef: RefObject<boolean> = useMountedRef();
  const [notification, setNotification] =
    useState<NotificationType>(LOADING_NOTIFICATION);

  // Effects
  useEffect((): void => {
    void children.then(setNotification).catch((err: unknown): void => {
      if (!isMountedRef.current) {
        return;
      }

      setNotification(mapErrorToNotification(err));
    });
  }, [children, isMountedRef]);

  return <Notification {...notification} />;
}
