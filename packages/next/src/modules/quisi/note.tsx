import type { ReactElement, ReactNode } from 'react';
import validateString from '../../utils/validate-string.js';
import styles from './note.module.scss';

interface Props {
  readonly children: ReactNode;
  readonly icon: ReactNode;
}

const CLASS_NAME: string = validateString(styles['note']);

export default function Note({ children, icon }: Props): ReactElement {
  return (
    <div className={CLASS_NAME}>
      <span>{icon}</span>
      <div>{children}</div>
    </div>
  );
}
