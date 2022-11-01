import type { BoxProps } from '@cloudscape-design/components/box';
import mapColorToCloudscapeColor from './utils/map-color-to-cloudscape-color';
import mapSizeToCloudscapeFontSize from './utils/map-size-to-cloudscape-font-size';

interface Props {
  readonly color: 'inherit' | 'label' | 'secondary-body' | undefined;
  readonly element: 'h2' | 'p' | undefined;
  readonly size:
    | 'large'
    | 'medium-heading'
    | 'medium'
    | 'small-heading'
    | 'small'
    | undefined;
}

interface State {
  readonly color: BoxProps.Color | undefined;
  readonly fontSize: BoxProps.FontSize | undefined;
  readonly variant: 'h2' | 'p' | undefined;
}

export default function useCloudscapeSpan({
  color,
  element,
  size,
}: Readonly<Props>): State {
  return {
    color: color && mapColorToCloudscapeColor(color),
    fontSize: size && mapSizeToCloudscapeFontSize(size),
    variant: element,
  };
}
