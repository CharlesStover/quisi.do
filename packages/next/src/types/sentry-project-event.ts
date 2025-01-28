import {
  type Context,
  type Contexts as SentryContexts,
  type Exception as SentryException,
  // SdkInfo,
  type StackFrame as SentryStackFrame,
  type Stacktrace as SentryStacktrace,
} from '@sentry/core';

// https://docs.sentry.io/api/events/list-a-projects-events/

interface FetchInvalidHttpCodeData {
  readonly url: string;
  readonly value: number;
}

interface HttpBreadcrumbData {
  readonly method: 'GET' | 'POST';
  readonly status_code: number;
  readonly url: string;
}

interface NavigationBreadcrumbData {
  readonly from: string;
  readonly to: string;
}

interface SentryBreadcrumb<T extends string, C extends string, D = null> {
  readonly category: C;
  readonly data: D;
  // Readonly event_id: null;
  readonly level: 'info';
  readonly message: string | null;
  readonly timestamp: string;
  readonly type: T;
}

interface StackFrame
  extends Omit<
    SentryStackFrame,
    | 'abs_path'
    | 'colno'
    | 'in_app'
    | 'instruction_addr'
    | 'lineno'
    | 'post_context'
    | 'pre_context'
  > {
  readonly absPath: string | null;
  readonly colNo: number | null;
  readonly context: readonly [number, string][];
  /*
   * Readonly inApp: boolean | null;
   * readonly instructionAddr: string | null;
   */
  readonly lineNo: number | null;
}

interface Stacktrace
  extends Omit<SentryStacktrace, 'frames_omitted' | 'frames'> {
  readonly frames: readonly StackFrame[];
  // Readonly framesOmitted: readonly [number, number] | null;
}

interface Exception extends Omit<SentryException, 'stacktrace' | 'thread_id'> {
  readonly rawStacktrace: Stacktrace;
  readonly stacktrace: Stacktrace;
  // Readonly threadId: number | null;
}

type Breadcrumb =
  | SentryBreadcrumb<'default', 'navigation', NavigationBreadcrumbData>
  | SentryBreadcrumb<'default', 'ui.click'>
  | SentryBreadcrumb<'http', 'fetch' | 'xhr', HttpBreadcrumbData>
  | SentryBreadcrumb<string, string, unknown>;

interface BreadcrumbsEntryData {
  readonly values: readonly Breadcrumb[];
}

export interface BrowserContext extends Context {
  readonly name: string;
  // Readonly type: 'browser';
  readonly version: string;
}

interface ClockDriftData {
  // Readonly name: 'timestamp';
  readonly sdk_time: string;
  readonly server_time: string;
}

export interface Contexts extends SentryContexts {
  readonly browser: BrowserContext;
}

interface ExceptionEntryData {
  /*
   * Readonly excOmitted: boolean;
   * readonly hasSystemFrames: boolean;
   */
  readonly values: readonly Exception[];
}

interface SentryEntry<T extends string, D> {
  readonly data: D;
  readonly type: T;
}

interface RequestEntryData {
  readonly cookies: readonly unknown[];
  /*
   * Readonly data: null;
   * readonly env: null;
   */
  readonly fragment: string | null;
  readonly headers: readonly [string, string][];
  // Readonly inferredContentType: null;
  readonly method: string | null;
  // Readonly query: readonly unknown[];
  readonly url: string;
}

export type Entry =
  | SentryEntry<'breadcrumbs', BreadcrumbsEntryData>
  | SentryEntry<'exception', ExceptionEntryData>
  | SentryEntry<'request', RequestEntryData>
  | SentryEntry<string, unknown>;

interface SentryError<T extends string, D> {
  readonly data: D;
  readonly message: string;
  readonly type: T;
}

interface JsInvalidSourcemapLocationData {
  readonly column: number;
  readonly row: number;
  readonly source: string;
}

export type Error =
  | SentryError<'clock_drift', ClockDriftData>
  | SentryError<'fetch_invalid_http_code', FetchInvalidHttpCodeData>
  | SentryError<'js_invalid_sourcemap_location', JsInvalidSourcemapLocationData>
  | SentryError<string, unknown>;

interface MetadataBase {
  readonly display_title_with_tree_label: boolean;
  readonly value: string;
}

export interface Metadata extends MetadataBase {
  readonly filename: string;
  readonly function: string;
  readonly type: 'ChunkLoadError' | 'Error' | 'OTLPExporterError';
}

export default interface SentryProjectEvent {
  readonly contexts: Contexts;
  readonly dateCreated: string;
  readonly dateReceived: string;
  /*
   * Readonly entries: readonly Entry[];
   * readonly errors: readonly Error[];
   */
  readonly eventID: string;
  // Readonly fingerprints: readonly string[];
  readonly groupID: string;
  readonly id: string;
  readonly location: string | null;
  readonly message: string;
  /*
   * Readonly metadata: Metadata | MetadataBase;
   * readonly platform: 'javascript' | 'python';
   * readonly projectID: string;
   * readonly sdk: SdkInfo;
   */
  readonly size: number;
  // Readonly tags: readonly Tag[];
  readonly title: string;
  /*
   * Readonly type: 'error';
   * readonly user: User;
   */
}

export interface Tag {
  readonly key: string;
  readonly value: string;
}
