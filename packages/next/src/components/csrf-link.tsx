import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import Link from '../modules/quisi/link.jsx';

interface Props {
  readonly feature: string;
}

export default function CsrfLink({ feature }: Props): ReactElement {
  return (
    <Link
      feature={feature}
      href="https://en.wikipedia.org/wiki/Cross-site_request_forgery"
      title="Cross-site request forgery - Wikipedia"
    >
      <I18n>cross-site request forgery</I18n>
    </Link>
  );
}
