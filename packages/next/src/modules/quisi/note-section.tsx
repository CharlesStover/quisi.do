import type { PropsWithChildren, ReactElement } from 'react';
import validateString from '../../utils/validate-string.js';
import styles from './note-section.module.scss';
import Section from './section.jsx';

const CLASS_NAME: string = validateString(styles['section']);

export default function NoteSection({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <Section>
      <div className={CLASS_NAME}>{children}</div>
    </Section>
  );
}
