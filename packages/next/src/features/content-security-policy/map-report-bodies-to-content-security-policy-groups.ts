import { not, sortEntriesByKey, sortNumbers } from 'fmrs';
import EMPTY_ARRAY from '../../constants/empty-array.js';
import type ReportBody from '../../types/content-security-policy-report-body.js';
import type Group from './content-security-policy-group.js';
import type Report from './content-security-policy-report.js';
import mapBlockedUrlToOriginPathname from './map-blocked-url-to-origin-pathname.js';

const INCREMENT = 1;

const sortReportsByCount = (
  { count: count1 }: Report,
  { count: count2 }: Report,
): number => sortNumbers(count2, count1);

const mapDispositionEntryToGroups = ([
  disposition,
  effectiveDirectiveMap,
]: readonly [
  string,
  ReadonlyMap<string, ReadonlyMap<string, readonly Report[]>>,
]): readonly Group[] => {
  const mapEffectiveDirectiveEntriesToGroups = ([
    effectiveDirective,
    originPathnameMap,
  ]: readonly [
    string,
    ReadonlyMap<string, readonly Report[]>,
  ]): readonly Group[] => {
    const mapOriginPathnameEntryToGroup = ([originPathname, reports]: readonly [
      string,
      readonly Report[],
    ]): Group => ({
      disposition,
      effectiveDirective,
      originPathname,
      urls: [...reports].sort(sortReportsByCount),
    });

    return [...originPathnameMap.entries()]
      .sort(sortEntriesByKey)
      .map(mapOriginPathnameEntryToGroup);
  };

  return [...effectiveDirectiveMap.entries()]
    .sort(sortEntriesByKey)
    .flatMap(mapEffectiveDirectiveEntriesToGroups);
};

export default function mapReportBodiesToContentSecurityPolicyGroups(
  bodies: readonly ReportBody[],
): readonly Group[] {
  const dispositionMap = new Map<
    string,
    ReadonlyMap<string, ReadonlyMap<string, readonly Report[]>>
  >();

  for (const {
    blockedURL,
    columnNumber,
    disposition,
    effectiveDirective,
    lineNumber,
    sourceFile,
  } of bodies) {
    const originPathname: string = mapBlockedUrlToOriginPathname(blockedURL);
    const effectiveDirectiveMap = new Map<
      string,
      ReadonlyMap<string, readonly Report[]>
    >(dispositionMap.get(disposition));
    const originPathnameMap = new Map<string, readonly Report[]>(
      effectiveDirectiveMap.get(effectiveDirective),
    );
    const reports: readonly Report[] =
      originPathnameMap.get(originPathname) ?? EMPTY_ARRAY;

    const findReport = (report: Report): boolean =>
      report.columnNumber === columnNumber &&
      report.lineNumber === lineNumber &&
      report.sourceFile === sourceFile;
    const report: Report | undefined = reports.find(findReport);
    if (typeof report === 'undefined') {
      originPathnameMap.set(originPathname, [
        ...reports,
        {
          columnNumber,
          count: 1,
          lineNumber,
          sourceFile,
        },
      ]);
    } else {
      originPathnameMap.set(originPathname, [
        ...reports.filter(not(findReport)),
        {
          ...report,
          count: report.count + INCREMENT,
        },
      ]);
    }
    effectiveDirectiveMap.set(effectiveDirective, originPathnameMap);
    dispositionMap.set(disposition, effectiveDirectiveMap);
  }

  return [...dispositionMap.entries()]
    .sort(sortEntriesByKey)
    .flatMap(mapDispositionEntryToGroups);
}
