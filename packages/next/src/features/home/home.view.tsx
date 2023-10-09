'use client';

import I18n from 'lazy-i18n';
import Image from 'next/image';
import { type ReactElement } from 'react';
import Container from '../../components/container';
import Div from '../../components/div';
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
    <>
      <Container actions={<ViewResumeButton />} header={<I18n>About</I18n>}>
        <Div className={contentClassName} display="flex" flexDirection="row">
          <Div className={avatarClassName} marginRight="large">
            <Image alt={avatarAlt} height={100} src={avatar} width={100} />
          </Div>
          <Div
            className={paragraphClassName}
            display="flex"
            flexDirection="column"
          >
            <Div element="p" marginBottom="medium">
              <strong>Quisido</strong> is a front end engineer driving a{' '}
              <abbr title="software as a service">SaaS</abbr> charity
              initiative.
            </Div>
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
          </Div>
        </Div>
      </Container>

      <Div marginTop="large">
        <Container header={<I18n>Projects</I18n>}>
          <ul className={projectListClassName}>
            {PROJECTS.map(mapProjectToAttributes).map(mapProjectToListItem)}
          </ul>
        </Container>
      </Div>
    </>
  );
}
