import SpaceBetween from '@awsui/components-react/space-between';
import I18n from 'lazy-i18n';
import type { ReactElement } from 'react';
import Container from '../../components/container';
import Span from '../../components/span';
import Wrapper from '../../components/wrapper';
import PROJECTS from '../../constants/projects';
import mapComponentToPropMapper from '../../utils/map-component-to-prop-mapper';
import validateString from '../../utils/validate-string';
import ProjectListItem from './components/project-list-item';
import ViewResumeButton from './components/view-resume-button';
import useHome from './home.hook';
import styles from './home.module.scss';
import avatar from './images/charles-stover.jpg';
import mapProjectToAttributes from './utils/map-project-to-attributes';

const avatarClassName: string = validateString(styles.avatar);
const contentClassName: string = validateString(styles.content);
const CURRENT_YEAR: number = new Date().getFullYear();
const ENTERPRISE_START_YEAR = 2016;
const FRONT_END_START_YEAR = 2001;
const FULL_STACK_START_YEAR = 2005;
const listClassName: string = validateString(styles.list);
const mapProjectToListItem = mapComponentToPropMapper(ProjectListItem);
const paragraphClassName: string = validateString(styles.p);
const projectListClassName: string = validateString(styles.projectList);

const ENTERPRISE_YOE: number = CURRENT_YEAR - ENTERPRISE_START_YEAR;
const FRONT_END_YOE: number = CURRENT_YEAR - FRONT_END_START_YEAR;
const FULL_STACK_YOE: number = CURRENT_YEAR - FULL_STACK_START_YEAR;

export default function Home(): ReactElement {
  const { avatarAlt } = useHome();

  return (
    <Wrapper toolsHide>
      <SpaceBetween size="l">
        <Container
          actions={<ViewResumeButton />}
          header={<I18n>About me</I18n>}
        >
          <SpaceBetween
            className={contentClassName}
            direction="horizontal"
            size="xxl"
          >
            <div className={avatarClassName}>
              <img alt={avatarAlt} height={100} src={avatar} width={100} />
            </div>
            <SpaceBetween
              className={paragraphClassName}
              direction="vertical"
              size="m"
            >
              <Span element="p">
                My name is <strong>Charles Stover</strong>. I am a{' '}
                <strong>staff-level front end engineer</strong> with an
                expertise in <strong>JavaScript and React</strong>. My focus is
                on long-term product visions, impact across teams, operational
                health, application monitoring, and{' '}
                <abbr title="user interface">UI</abbr>/
                <abbr title="user experience">UX</abbr>.
              </Span>
              <ul className={listClassName}>
                <li>
                  <I18n n={ENTERPRISE_YOE}>Enterprise: $n years</I18n>
                </li>
                <li>
                  <I18n n={FRONT_END_YOE}>Front end: $n years</I18n>
                </li>
                <li>
                  <I18n n={FULL_STACK_YOE}>Full stack: $n years</I18n>
                </li>
              </ul>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container header={<I18n>Projects</I18n>}>
          <ul className={projectListClassName}>
            {PROJECTS.map(mapProjectToAttributes).map(mapProjectToListItem)}
          </ul>
        </Container>
      </SpaceBetween>
    </Wrapper>
  );
}
