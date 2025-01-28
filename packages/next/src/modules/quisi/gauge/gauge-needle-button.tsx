import { arc } from 'd3-shape';
import type { ReactElement } from 'react';
import {
  NEEDLE_BUTTON_WIDTH,
  NEEDLE_WIDTH,
  RADIUS,
} from './gauge-constants.js';

const DOUBLE = 2;
const CIRCLE: number = DOUBLE * Math.PI;

export default function GaugeNeedleButton(): ReactElement {
  return (
    <path
      d={
        arc()({
          endAngle: CIRCLE,
          innerRadius: 0,
          outerRadius: NEEDLE_WIDTH * NEEDLE_BUTTON_WIDTH,
          startAngle: 0,
        }) ?? ''
      }
      fill="#c0c0c0"
      transform={`translate(${RADIUS}, ${RADIUS})`}
    />
  );
}
