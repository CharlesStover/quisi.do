import I18n from 'lazy-i18n';
import { type ReactElement } from 'react';
import Div from '../../../modules/quisi/div.jsx';
import Section from '../../../modules/quisi/section.jsx';

export { default as generateStaticParams } from '../../../features/generate-locale-static-params.js';

export default function CharitiesPage(): ReactElement {
  return (
    <Section header={<I18n>Charities</I18n>}>
      <Div element="p">
        quisi.do is in the process of defining charities. As this matter has
        legal, financial, and moral implications, the decisions will not be made
        lightly and will be posted after they are ready.
      </Div>
    </Section>
  );
}
