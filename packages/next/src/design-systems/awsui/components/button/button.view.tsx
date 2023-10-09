import Button, { type ButtonProps } from '@awsui/components-react/button';
import { type ReactElement } from 'react';
import { type Props } from '../../../../components/button';
import useButton from './button.hook';

export default function AwsuiButton({
  category,
  children,
  href,
  onClick,
  variant,
}: Props): ReactElement {
  const { handleClick, iconAlt, iconName, target } = useButton({
    category,
    children,
    href,
    onClick,
  });

  // Workaround until AWS UI supports TypeScript 4.4 exact optional properties.
  // https://github.com/aws/awsui-documentation/issues/14
  const optionalProps: Pick<ButtonProps, 'href' | 'iconAlt' | 'iconName'> = {};

  if (typeof href !== 'undefined') {
    optionalProps.href = href;
  }

  if (typeof iconAlt !== 'undefined') {
    optionalProps.iconAlt = iconAlt;
  }

  if (typeof iconName !== 'undefined') {
    optionalProps.iconName = iconName;
  }

  return (
    <Button
      iconAlign="right"
      onClick={handleClick}
      target={target}
      variant={variant}
      {...optionalProps}
    >
      {children}
    </Button>
  );
}
