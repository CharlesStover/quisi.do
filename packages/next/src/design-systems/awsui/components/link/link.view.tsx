import Link, { type LinkProps } from '@awsui/components-react/link';
import { type ReactElement } from 'react';
import { type Props } from '../../../../components/link';
import useLink from './link.hook';

export default function AwsuiLink({
  category,
  children,
  className,
  href,
  label,
  title,
}: Props): ReactElement {
  const { external, handleFollow, ref, rel, target } = useLink({
    category,
    children,
    href,
    title,
  });

  const optionalProps: Pick<LinkProps, 'className' | 'rel'> = {};
  if (typeof className !== 'undefined') {
    optionalProps.className = className;
  }

  if (typeof rel !== 'undefined') {
    optionalProps.rel = rel;
  }

  return (
    /**
     * AWSUI's `<Link>` does not support `title`. We can remove this `ref` with
     *   this pull request:
     * https://github.com/cloudscape-design/components/pull/1600
     */
    <span ref={ref}>
      <Link
        {...optionalProps}
        ariaLabel={label}
        external={external}
        href={href}
        onFollow={handleFollow}
        target={target}
      >
        {children}
      </Link>
    </span>
  );
}
