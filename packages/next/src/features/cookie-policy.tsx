import I18n from 'lazy-i18n';
import { type ReactElement } from 'react';
import Div from '../modules/quisi/div.jsx';
import Section from '../modules/quisi/section.jsx';

export default function CookiePolicy(): ReactElement {
  return (
    <Section header={<I18n>Cookie policy</I18n>}>
      <Div element="p">
        quisi.do&apos;s cookie policy will be documented after its services are
        finalized.
      </Div>
    </Section>
  );
}
