import { type ReactElement } from 'react';

interface Props {
  readonly as?: string | undefined;
  readonly children: string;
  readonly cors?: boolean | undefined;
}

export default function Preconnect({
  as,
  children,
  cors = false,
}: Props): ReactElement {
  const getCrossOrigin = (): 'anonymous' | 'use-credentials' | undefined => {
    if (!cors) {
      return;
    }
    return 'anonymous';
  };

  return (
    <link
      as={as}
      crossOrigin={getCrossOrigin()}
      href={children}
      rel="preconnect"
    />
  );
}
