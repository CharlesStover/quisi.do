import type { AwsRum } from 'aws-rum-web';
import { useCallback, type ComponentType, type ReactElement } from 'react';
import useAwsRum from '../hooks/use-aws-rum.js';

interface HocProps {
  readonly recordError: (error: unknown) => void;
}

export default function withRecordError<Props extends HocProps>(
  Component: ComponentType<Props>,
): ComponentType<Omit<Props, keyof HocProps>> {
  return function AwsRumComponent(
    props: Omit<Props, keyof HocProps>,
  ): ReactElement {
    const awsRum: AwsRum = useAwsRum();

    const recordError = useCallback(
      (err: unknown): void => {
        awsRum.recordError(err);
      },
      [awsRum],
    );

    return <Component {...(props as Props)} recordError={recordError} />;
  };
}
