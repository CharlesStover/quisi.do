import { type CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import { type NonCancelableCustomEvent } from '@cloudscape-design/components/interfaces';

type ReadonlyCloudscapeDesignCollectionPreferencesEvent<T> = Readonly<
  NonCancelableCustomEvent<Readonly<CollectionPreferencesProps.Preferences<T>>>
>;

export type { ReadonlyCloudscapeDesignCollectionPreferencesEvent as default };
