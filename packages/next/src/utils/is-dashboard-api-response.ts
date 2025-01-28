import { isNumber, isObject } from 'fmrs';
import type DashboardApiResponse from '../types/dashboard-api-response.js';

const DOUBLE = 2;
const TRIPLE = 3;

const isNumberArray = (value: unknown): value is readonly number[] =>
  Array.isArray(value) && value.every(isNumber);

const isNumberDouble = (value: unknown): value is readonly [number, number] =>
  isNumberArray(value) && value.length === DOUBLE;

const isNumberTriple = (value: unknown): value is readonly [number, number] =>
  isNumberArray(value) && value.length === TRIPLE;

export default function isDashboardApiResponse(
  value: unknown,
): value is DashboardApiResponse {
  if (!isObject(value)) {
    return false;
  }

  return (
    'cls' in value &&
    isNumberDouble(value.cls) &&
    'dcl' in value &&
    isNumberDouble(value.dcl) &&
    'domComplete' in value &&
    isNumberDouble(value.domComplete) &&
    'errorCount' in value &&
    isNumberTriple(value.errorCount) &&
    'fcp' in value &&
    isNumberDouble(value.fcp) &&
    'fip' in value &&
    isNumberDouble(value.fip) &&
    'inp' in value &&
    isNumberDouble(value.inp) &&
    'lcp' in value &&
    isNumberDouble(value.lcp) &&
    'loadEvent' in value &&
    isNumberDouble(value.loadEvent) &&
    'loadingTime' in value &&
    isNumberDouble(value.loadingTime) &&
    'sessionTimeSpent' in value &&
    isNumber(value.sessionTimeSpent) &&
    'ttfb' in value &&
    isNumberDouble(value.ttfb) &&
    'viewTimeSpent' in value &&
    isNumber(value.viewTimeSpent)
  );
}
