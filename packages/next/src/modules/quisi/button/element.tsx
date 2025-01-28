import type { CSSProperties, PropsWithChildren, ReactElement } from 'react';
import ButtonElement from './button-element.jsx';
import LinkElement from './link-element.jsx';

interface ElementProps {
  readonly className: string;
  readonly href?: string | undefined;
  readonly id: string;
  readonly onPress: VoidFunction;
  readonly style: CSSProperties;
}

export default function Element({
  children,
  className,
  href,
  id,
  onPress,
  style,
}: PropsWithChildren<ElementProps>): ReactElement {
  if (typeof href === 'undefined') {
    return (
      <ButtonElement
        className={className}
        id={id}
        onPress={onPress}
        style={style}
      >
        {children}
      </ButtonElement>
    );
  }

  return (
    <LinkElement
      className={className}
      href={href}
      id={id}
      onPress={onPress}
      style={style}
    >
      {children}
    </LinkElement>
  );
}
