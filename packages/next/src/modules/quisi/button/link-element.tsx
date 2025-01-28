import { useLink } from '@react-aria/link';
import {
  useRef,
  type CSSProperties,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import optional from '../../../utils/optional.js';

interface Props {
  readonly className: string;
  readonly href: string;
  readonly id: string;
  readonly onPress: VoidFunction;
  readonly style: CSSProperties;
}

export default function LinkElement({
  children,
  className,
  href,
  id,
  onPress,
  style,
}: PropsWithChildren<Props>): ReactElement {
  const { linkProps } = useLink(
    {
      ...optional('href', href),
      onPress,
    },
    useRef(null),
  );

  return (
    <a {...linkProps} className={className} id={id} style={style}>
      {children}
    </a>
  );
}
