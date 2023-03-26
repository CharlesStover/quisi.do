import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import Link from '../../../../components/link';
import GITHUB_COMMIT_URL from '../../../../constants/github-commit-url';
import GITHUB_REPOSITORY_URL from '../../../../constants/github-repository-url';
import VERSION from '../../../../constants/version';
import isUndefined from '../../../../utils/is-undefined';

const VERSION_HREF: string | undefined =
  GITHUB_COMMIT_URL ?? GITHUB_REPOSITORY_URL;

export default function FooterLink(): ReactElement {
  if (isUndefined(VERSION_HREF)) {
    return <I18n version={VERSION}>version: $version</I18n>;
  }

  return (
    <I18n version={<Link href={VERSION_HREF}>{VERSION}</Link>}>
      version: $version
    </I18n>
  );
}
