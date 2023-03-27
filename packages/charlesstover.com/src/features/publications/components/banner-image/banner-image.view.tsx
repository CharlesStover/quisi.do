import type { ReactElement } from 'react';
import isDefined from '../../../../utils/is-defined';
import validateString from '../../../../utils/validate-string';
import styles from './banner-image.module.scss';

interface Props {
  readonly src?: string | undefined;
  readonly title?: string | undefined;
}

const imageClassName: string = validateString(styles.image);
const undefinedClassName: string = validateString(styles.undefined);

export default function PublicationsBannerImage({
  src,
  title,
}: Readonly<Props>): ReactElement {
  if (!isDefined(src)) {
    return <div className={undefinedClassName}>&nbsp;</div>;
  }

  return <img alt={title} className={imageClassName} src={src} width={320} />;
}
