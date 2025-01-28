import I18n, { useTranslate, type TranslateFunction } from 'lazy-i18n';
import { usePathname } from 'next/navigation.js';
import { useMemo, type ReactElement } from 'react';
import {
  PATREON_OAUTH_CLIENT_ID,
  PATREON_OAUTH_REDIRECT_URI,
} from '../constants/patreon-oauth.js';
import { useSessionId } from '../contexts/session-id.js';
import useSearch from '../hooks/use-search.js';
import Link from '../modules/quisi/link.jsx';

interface State {
  readonly href: string;
  readonly title: string;
}

const SCOPES: readonly string[] = [
  // 'campaigns',
  // 'campaigns.members',
  // 'campaigns.members[email]',
  // 'campaigns.members.address',
  // 'campaigns.posts',
  'identity',
  'identity[email]',
  // 'identity.memberships',
];

function useAuthenticateLink(): State {
  // Contexts
  const pathname: string = usePathname();
  const search: string = useSearch();
  const sessionId: string | undefined = useSessionId();
  const translate: TranslateFunction = useTranslate();

  // States
  return {
    title: translate('Authenticate') ?? 'Authenticate',

    href: useMemo((): string => {
      const authSearch: string = new URLSearchParams({
        client_id: PATREON_OAUTH_CLIENT_ID,
        redirect_uri: PATREON_OAUTH_REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES.join(' '),
        state: JSON.stringify({
          returnPath: `${pathname}${search}`,
          sessionId,
        }),
      }).toString();

      return `https://www.patreon.com/oauth2/authorize?${authSearch}`;
    }, [pathname, search, sessionId]),
  };
}

export default function AuthenticateLink(): ReactElement {
  const { href, title } = useAuthenticateLink();

  return (
    <Link feature="header/authenticate-link" href={href} title={title}>
      <I18n>Authenticate</I18n>
    </Link>
  );
}
