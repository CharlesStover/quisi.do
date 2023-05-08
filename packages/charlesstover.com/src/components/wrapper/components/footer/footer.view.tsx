import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import Div from '../../../../components/div';
import Span from '../../../../components/span';
import validateString from '../../../../utils/validate-string';
import Link from '../../components/footer-link';
import useFooter from './footer.hook';
import styles from './footer.module.scss';

const rootClassName: string = validateString(styles.root);
const NONE = 0;

export default function Footer(): ReactElement {
  const { features } = useFooter();

  return (
    <Div className={rootClassName} marginTop="large">
      <Span color="label">
        <I18n>Made with 💔 by Charles Stover</I18n>
      </Span>
      {features.length > NONE && (
        <Span color="label" size="small">
          {features.join(', ')}
        </Span>
      )}
      <Span color="label">
        <Link />
      </Span>
    </Div>
  );
}
