import type { Attributes } from 'react';
import type Project from '../../../types/project';

export default function mapProjectToAttributes(
  project: Project,
): Required<Attributes> & Project {
  return {
    ...project,
    key: project.name,
  };
}
