import type { ContextManager } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import BatchSpanProcessor from './batch-span-processor.js';
import CompositePropagator from './composite-propagator.js';
import Resource from './resource.js';

/*
 *Critical dependency: the request of a dependency is an expression
 *
 *const loadDocumentLoadInstrumentation = (): Promise<Instrumentation> => {
 *  return import('@opentelemetry/instrumentation-document-load')
 *    .then(({ DocumentLoadInstrumentation }): Instrumentation => {
 *      return new DocumentLoadInstrumentation();
 *    });
 *};
 *
 *const loadFetchInstrumentation = (): Promise<Instrumentation> => {
 *  return import('./fetch-instrumentation.js')
 *    .then(({ default: FetchInstrumentation }): Instrumentation => {
 *      return new FetchInstrumentation();
 *    });
 *};
 *
 *const loadUserInteractionInstrumentation = (): Promise<Instrumentation> => {
 *  return import('@opentelemetry/instrumentation-user-interaction')
 *    .then(({ UserInteractionInstrumentation }): Instrumentation => {
 *      return new UserInteractionInstrumentation();
 *    });
 *};
 *
 *const loadXMLHttpRequestInstrumentation = (): Promise<Instrumentation> => {
 *  return import('./xml-http-request-instrumentation.js')
 *    .then(({ default: XMLHttpRequestInstrumentation }): Instrumentation => {
 *      return new XMLHttpRequestInstrumentation();
 *    });
 *};
 */

export default class WebTracerProviderImpl extends WebTracerProvider {
  public readonly batchSpanProcessor: BatchSpanProcessor;
  public readonly contextManager: ContextManager = new ZoneContextManager();
  public readonly compositePropagator: CompositePropagator =
    new CompositePropagator();

  public constructor(hostname: string) {
    const batchSpanProcessor = new BatchSpanProcessor(hostname);

    super({
      resource: new Resource(hostname),
      spanProcessors: [batchSpanProcessor],
    });

    this.register({
      contextManager: this.contextManager,
      propagator: this.compositePropagator,
    });

    /*
     *Critical dependency: the request of a dependency is an expression
     *
     *if (typeof window !== 'undefined') {
     *  void loadDocumentLoadInstrumentation()
     *    .then((instrumentation: Instrumentation): void => {
     *      instrumentation.setTracerProvider(this);
     *    })
     *    .catch(noop);
     *
     *  void loadFetchInstrumentation()
     *    .then((instrumentation: Instrumentation): void => {
     *      instrumentation.setTracerProvider(this);
     *    })
     *    .catch(noop);
     *
     *  void loadUserInteractionInstrumentation()
     *    .then((instrumentation: Instrumentation): void => {
     *      instrumentation.setTracerProvider(this);
     *    })
     *    .catch(noop);
     *
     *  void loadXMLHttpRequestInstrumentation()
     *    .then((instrumentation: Instrumentation): void => {
     *      instrumentation.setTracerProvider(this);
     *    })
     *    .catch(noop);
     *}
     */

    this.batchSpanProcessor = batchSpanProcessor;
  }
}
