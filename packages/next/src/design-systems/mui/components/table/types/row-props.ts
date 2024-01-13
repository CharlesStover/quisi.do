import { type Attributes, type ComponentType } from 'react';
import type CellProps from './cell-props.js';

export default interface MuiTableRowProps {
  readonly Description?: ComponentType<Record<string, never>> | undefined;
  readonly cellProps: readonly (CellProps & Required<Attributes>)[];
}
