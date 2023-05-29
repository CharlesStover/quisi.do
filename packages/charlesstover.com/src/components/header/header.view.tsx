import type { ReactElement } from 'react';
import Fallback from './components/fallback';
import DesignSystem from '../design-system';
import type Props from './types/props';

export default function Header(props: Readonly<Props>): ReactElement {
  return <DesignSystem Fallback={Fallback} props={props} type="header" />;
}
