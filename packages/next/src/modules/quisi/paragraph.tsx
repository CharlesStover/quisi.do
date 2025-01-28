import type { PropsWithChildren, ReactElement } from 'react';
import validateString from '../../utils/validate-string.js';
import styles from './paragraph.module.scss';

const CLASS_NAME: string = validateString(styles['p']);

export default function Paragraph({
  children,
}: PropsWithChildren): ReactElement {
  return <p className={CLASS_NAME}>{children}</p>;
}
