import GITHUB_COMMIT_URL from '../../constants/github-commit-url';
import GITHUB_REPOSITORY_URL from '../../constants/github-repository-url';

interface State {
  readonly versionHref: string | undefined;
}

export default function useFooterLink(): State {
  return {
    versionHref: GITHUB_COMMIT_URL ?? GITHUB_REPOSITORY_URL,
  };
}