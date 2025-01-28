'use client';

import { arc } from 'd3-shape';
import { useEffect, useState, type ReactElement } from 'react';
import validateString from '../../../utils/validate-string.js';
import { NEEDLE_RADIANS, NEEDLE_WIDTH, RADIUS } from './gauge-constants.js';
import GaugeNeedleButton from './gauge-needle-button.jsx';
import styles from './gauge-needle.module.scss';

interface Props {
  readonly className?: string | undefined;
  readonly max: number;
  readonly min: number;
  readonly value: number;
}

const CLASS_NAME: string = validateString(styles['needle']);
const HALF = 0.5;

export default function GaugeNeedle({
  className: classNameProp,
  max,
  min,
  value: valueProp,
}: Props): ReactElement {
  // States
  const [value, setValue] = useState(min);

  // Effects
  useEffect((): void => {
    setValue(valueProp);
  }, [valueProp]);

  const percentage: number = (value - min) / (max - min);
  const rotation: number = Math.PI * percentage - Math.PI * HALF;

  const needle = arc();
  needle.cornerRadius(RADIUS);
  const arcPathD: string | null = needle({
    endAngle: Math.PI + NEEDLE_RADIANS * HALF,
    innerRadius: 1,
    outerRadius: RADIUS + NEEDLE_WIDTH,
    startAngle: Math.PI - NEEDLE_RADIANS * HALF,
  });

  // Const tipX: number = RADIUS + RADIUS * Math.cos(gaugeAngle + Math.PI);
  // Const tipY: number = RADIUS - RADIUS * Math.sin(gaugeAngle);
  const classNames: string[] = [CLASS_NAME];
  if (typeof classNameProp === 'string') {
    classNames.push(classNameProp);
  }
  return (
    <>
      <path
        className={classNames.join(' ')}
        d={arcPathD ?? ''}
        fill="inherit"
        style={{
          transform: `rotate(${rotation}rad) translate(50%, 0)`,
          transformOrigin: `50% calc(100% - ${NEEDLE_WIDTH}px)`,
        }}
      />
      <GaugeNeedleButton />
    </>
  );
}
