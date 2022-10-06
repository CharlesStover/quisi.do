import type { BreadcrumbGroupProps } from '@awsui/components-react/breadcrumb-group';
import type { TranslateFunction } from 'lazy-i18n';
import { useTranslate } from 'lazy-i18n';
import { useMemo } from 'react';
import { useBreadcrumbGroup } from 'use-awsui-router';
import type Breadcrumb from '../../../../types/breadcrumb';
import mapBreadcrumbsToAwsBreadcrumbGroupItems from '../../utils/map-breadcrumbs-to-aws-breadcrumb-group-items';

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

export default function useAwsWrapperBreadcrumbs(
  breadcrumbs: readonly Readonly<Breadcrumb>[],
): State {
  // Contexts
  const translate: TranslateFunction = useTranslate();

  // States
  const { handleFollow } = useBreadcrumbGroup();

  return {
    ariaLabel: translate('Breadcrumbs'),
    handleFollow,

    items: useMemo((): readonly BreadcrumbGroupProps.Item[] => {
      return mapBreadcrumbsToAwsBreadcrumbGroupItems(breadcrumbs);
    }, [breadcrumbs]),
  };
}