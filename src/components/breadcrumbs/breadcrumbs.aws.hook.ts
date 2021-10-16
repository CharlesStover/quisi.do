import type { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';
import type { TranslateFunction } from 'lazy-i18n';
import { useTranslate } from 'lazy-i18n';
import { useBreadcrumbGroup } from 'use-awsui-router';
import useParamsMemo from 'use-params-memo';
import type Breadcrumb from '../../types/breadcrumb';
import mapBreadcrumbsToAwsBreadcrumbs from './breadcrumbs.util.map-breadcrumbs-to-aws-breadcrumbs';

interface State {
  readonly ariaLabel: string | undefined;
  readonly items: readonly BreadcrumbGroupProps.Item[];
  readonly handleFollow: (
    event: Readonly<
      CustomEvent<
        Readonly<
          BreadcrumbGroupProps.ClickDetail<Readonly<BreadcrumbGroupProps.Item>>
        >
      >
    >,
  ) => void;
}

export default function useAwsBreadcrumbs(
  breadcrumbs: readonly Readonly<Breadcrumb>[],
): State {
  // Contexts
  const translate: TranslateFunction = useTranslate();

  // States
  const { handleFollow } = useBreadcrumbGroup();

  return {
    ariaLabel: translate('Breadcrumbs'),
    handleFollow,
    items: useParamsMemo(mapBreadcrumbsToAwsBreadcrumbs, [breadcrumbs]),
  };
}