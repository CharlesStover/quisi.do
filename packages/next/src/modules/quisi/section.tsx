'use client';

import {
  use,
  useLayoutEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import useTheme from '../../hooks/use-theme.js';
import createRandomNumberGenerator from '../../utils/create-random-number-generator.js';
import validateString from '../../utils/validate-string.js';
import Header from './header.js';
import type { HeadingLevel } from './heading-level.js';
import incrementHeadingLevel from './increment-heading-level.js';
import SectionLevelContext from './section-level-context.js';
import styles from './section.module.scss';

export interface Props {
  readonly actions?: ReactNode | undefined;
  readonly children: ReactNode;
  readonly header?: ReactNode | undefined;
}

const FOOTER_CLASS_NAME: string = validateString(styles['footer']);
const INITIAL_ROTATION = 0;
const MAXIMUM_ROTATION = 2;
const MINIMUM_ROTATION = -2;
const NEGATIVE = -1;
const SECTION_CLASS_NAME: string = validateString(styles['section']);

const getRotation = createRandomNumberGenerator(
  MINIMUM_ROTATION,
  MAXIMUM_ROTATION,
);

export default function QuisiSection({
  actions,
  children,
  header,
}: Props): ReactElement {
  // Contexts
  const { foregroundHex } = useTheme();
  const level: HeadingLevel = use(SectionLevelContext);

  // States
  const [rotation, setRotation] = useState(INITIAL_ROTATION);

  // Effects
  useLayoutEffect((): void => {
    setRotation(getRotation);
  }, []);

  const negativeRotationStr: string = (NEGATIVE * rotation).toString();
  const rotationStr: string = rotation.toString();
  return (
    <section
      className={SECTION_CLASS_NAME}
      style={{
        color: foregroundHex,
        transform: `rotate(${rotationStr}deg)`,
      }}
    >
      <div
        style={{
          transform: `rotate(${negativeRotationStr}deg)`,
        }}
      >
        <SectionLevelContext.Provider value={incrementHeadingLevel(level)}>
          {typeof header !== 'undefined' && (
            <Header level={level}>{header}</Header>
          )}
          <div>{children}</div>
          {typeof actions !== 'undefined' && (
            <footer className={FOOTER_CLASS_NAME}>{actions}</footer>
          )}
        </SectionLevelContext.Provider>
      </div>
    </section>
  );
}
