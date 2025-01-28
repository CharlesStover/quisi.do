'use client';

import { type ReactNode } from 'react';
import usePathname from '../hooks/use-pathname.js';
import Link from '../modules/quisi/link.jsx';
import validateString from '../utils/validate-string.js';
import styles from './header-heading-text.module.scss';

const TEXT_CLASS_NAME: string = validateString(styles['text']);

export default function HeaderHeadingText(): ReactNode {
  const pathname: string = usePathname();
  if (pathname === '/') {
    return 'quisi.do';
  }

  return (
    <Link feature="header-heading-text" href="/" title="quisi.do">
      <span className={TEXT_CLASS_NAME}>quisi.do</span>
    </Link>
  );
}
