'use client';

import { I18nProvider } from 'lazy-i18n';
import { type ReactElement } from 'react';
import { default as Locale } from '../../constants/locale.js';
import TRANSLATIONS from '../../constants/translations.js';
import { LocaleProvider } from '../../contexts/locale.js';
// Import Notifications from '../../features/notifications.js';
import type NextLayoutProps from '../../types/next-layout-props.js';
import useLocaleLayout from './locale-layout.hook.js';
import type Params from './types/params.js';

/**
 * The `[locale]` layout wraps all content in <body>.
 */

export default function LocaleLayout({
  children,
  params,
}: Readonly<NextLayoutProps<Params>>): ReactElement {
  const { locale, localeContextValue } = useLocaleLayout({
    params,
  });

  return (
    <LocaleProvider value={localeContextValue}>
      <I18nProvider
        fallbackLocale={Locale.English}
        locale={locale}
        translations={TRANSLATIONS}
      >
        {children}
      </I18nProvider>
    </LocaleProvider>
  );
}
