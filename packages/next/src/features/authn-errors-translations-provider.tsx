import { I18nProvider } from 'lazy-i18n';
import type { PropsWithChildren, ReactElement } from 'react';
import AUTHN_ERRORS_TRANSLATIONS from '../constants/authn-errors-translations.js';
import { useLocale } from '../contexts/locale.js';

export default function AuthnErrorsTranslationsProvider({
  children,
}: PropsWithChildren): ReactElement {
  // Contexts
  const [locale] = useLocale();

  return (
    <I18nProvider locale={locale} translations={AUTHN_ERRORS_TRANSLATIONS}>
      {children}
    </I18nProvider>
  );
}
