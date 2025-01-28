import { arc } from 'd3-shape';
import type { ReactElement } from 'react';
import { RADIUS } from './gauge-constants.js';

interface Props {
  readonly className?: string | undefined;
  readonly from: number;
  readonly max: number;
  readonly min: number;
  readonly to: number;
}

const HALF = 0.5;
const D3_ANGLE_OFFSET: number = -Math.PI * HALF;

export default function GaugePath({
  className,
  from,
  max,
  min,
  to,
}: Props): ReactElement {
  const fromPercentage: number = (from - min) / (max - min);
  const toPercentage: number = (to - min) / (max - min);
  const angle: number = Math.PI * (toPercentage - fromPercentage);
  const startAngle: number = D3_ANGLE_OFFSET + Math.PI * fromPercentage;
  const arcPathD: string | null = arc()({
    endAngle: startAngle + angle,
    innerRadius: 0,
    outerRadius: RADIUS,
    startAngle,
  });

  return (
    <path
      className={className}
      d={arcPathD ?? ''}
      fill="red"
      transform={`translate(${RADIUS}, ${RADIUS})`}
    />
  );
}
