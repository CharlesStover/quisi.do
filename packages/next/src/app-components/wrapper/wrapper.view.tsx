'use client';

import I18n, { useTranslate, type TranslateFunction } from 'lazy-i18n';
import { useSelectedLayoutSegment } from 'next/navigation.js';
import {
  type PropsWithChildren,
  type ReactElement,
  useMemo,
  useState,
} from 'react';
import Wrapper from '../../components/wrapper';
import EMPTY_ARRAY from '../../constants/empty-array';
import { NotifyProvider } from '../../contexts/notify';
import useEffectEvent from '../../hooks/use-effect-event';
import Breadcrumb from '../../types/breadcrumb';
import Notification from '../../types/notification';

export default function AppWrapper({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  // Contexts
  const segment: string | null = useSelectedLayoutSegment();
  const translate: TranslateFunction = useTranslate();

  // States
  const [notifications, setNotifications] =
    useState<readonly Notification[]>(EMPTY_ARRAY);

  return (
    <Wrapper
      notifications={notifications}
      breadcrumbs={useMemo((): readonly Breadcrumb[] => {
        switch (segment) {
          case null:
            return [];
          case 'dashboard':
            return [
              {
                children: translate('Dashboard') ?? '...',
                path: '/dashboard',
              },
            ];
          case 'packages':
            return [
              {
                children: translate('Packages') ?? '...',
                path: '/packages',
              },
            ];
          case 'publications':
            return [
              {
                children: translate('Publications') ?? '...',
                path: '/publications',
              },
            ];
          case 'quotes':
            return [
              {
                children: translate('Quotes') ?? '...',
                path: '/quotes',
              },
            ];
          case 'spritesheet2gif':
            return [
              {
                children: 'Sprite sheet to GIF',
                path: '/spritesheet2gif',
              },
            ];
          default:
            throw new Error(`Unknown breadcrumbs segment: ${segment}`);
        }
      }, [segment, translate])}
      fallback={useMemo((): ReactElement | undefined => {
        switch (segment) {
          case null:
            return;
          case 'dashboard':
            return <I18n>Loading dashboard</I18n>;
          case 'packages':
            return <I18n>Loading packages</I18n>;
          case 'publications':
            return <I18n>Loading publications</I18n>;
          case 'quotes':
            return <I18n>Loading quotes</I18n>;
          case 'spritesheet2gif':
            return <>...</>;
          default:
            throw new Error(`Unknown fallback segment: ${segment}`);
        }
      }, [segment])}
    >
      <NotifyProvider
        value={useEffectEvent((notification: Notification): void => {
          setNotifications(
            (
              oldNotifications: readonly Notification[],
            ): readonly Notification[] => [...oldNotifications, notification],
          );
        })}
      >
        {children}
      </NotifyProvider>
    </Wrapper>
  );
}
