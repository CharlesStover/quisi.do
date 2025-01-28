import { useButton } from '@react-aria/button';
import {
  useRef,
  type CSSProperties,
  type PropsWithChildren,
  type ReactElement,
} from 'react';

interface Props {
  readonly className: string;
  readonly id: string;
  readonly onPress: VoidFunction;
  readonly style: CSSProperties;
}

export default function ButtonElement({
  children,
  className,
  id,
  onPress,
  style,
}: PropsWithChildren<Props>): ReactElement {
  const { buttonProps } = useButton(
    {
      onPress,
    },
    useRef(null),
  );

  return (
    <button {...buttonProps} className={className} id={id} style={style}>
      {children}
    </button>
  );
}
