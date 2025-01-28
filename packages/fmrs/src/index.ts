import sortArraysByIndex from './sort-arrays-by-index.js';

export { default as hasKeys } from './has-keys.js';
export { default as identity } from './identity.js';
export {
  default as filterByDefined,
  default as findDefined,
  default as isDefined,
} from './is-defined.js';
export { default as isNot } from './is-not.js';
export {
  default as filterByNumber,
  default as findNumber,
  default as isNumber,
} from './is-number.js';
export {
  default as filterByObject,
  default as findObject,
  default as isObject,
} from './is-object.js';
export {
  default as filterByRecord,
  default as findRecord,
  default as isRecord,
} from './is-record.js';
export {
  default as filterByString,
  default as findString,
  default as isString,
} from './is-string.js';
export {
  default as filterByUndefined,
  default as isUndefined,
} from './is-undefined.js';
export { default as is } from './is.js';
export { default as mapBooleanToNumber } from './map-boolean-to-number.js';
export { default as mapEntriesToRecord } from './map-entries-to-record.js';
export { default as mapEntryToKey } from './map-entry-to-key.js';
export { default as mapEntryToValue } from './map-entry-to-value.js';
export { default as mapMapToEntries } from './map-map-to-entries.js';
export { default as mapMapToRecord } from './map-map-to-record.js';
export { default as mapToError } from './map-to-error.js';
export { default as mapToIndex } from './map-to-index.js';
export { default as mapToString } from './map-to-string.js';
export { default as not } from './not.js';
export { default as reduceEntriesToRecord } from './reduce-entries-to-record.js';
export { default as sortNumbers } from './sort-numbers.js';
export { default as sortStrings } from './sort-strings.js';
export { default as sort } from './sort.js';
export { sortArraysByIndex };

const FIRST = 0;
const SECOND = 1;

export const sortEntriesByKey = sortArraysByIndex(FIRST);
export const sortEntriesByValue = sortArraysByIndex(SECOND);
