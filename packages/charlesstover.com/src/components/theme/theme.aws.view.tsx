import type { ReactElement } from 'react';
import useAwsTheme from './theme.aws.hook';
import type Props from './types/props';

export default function AwsTheme({ children }: Readonly<Props>): ReactElement {
  useAwsTheme();
  return <>{children}</>;
}
