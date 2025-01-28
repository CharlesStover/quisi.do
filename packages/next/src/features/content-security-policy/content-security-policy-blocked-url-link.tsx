import type { ReactElement } from 'react';
import Link from '../../modules/quisi/link.jsx';
import mapUrlToHref from '../../utils/map-url-to-href.js';

interface Props {
  readonly children: string | null;
}

export default function ContentSecurityPolicyBlockedUrlLink({
  children,
}: Props): ReactElement | null {
  if (children === null) {
    return null;
  }

  const href: string | null = mapUrlToHref(children);
  if (href === null) {
    return null;
  }
  return (
    <Link
      feature="content-security-policy/blocked-url-link"
      href={href}
      title=""
    >
      {children}
    </Link>
  );
}
