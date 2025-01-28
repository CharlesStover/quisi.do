import { mapToError } from 'fmrs';

export default class HTMLScriptElementLoadPromise implements Promise<unknown> {
  #promise: Promise<void>;

  public constructor(script: HTMLScriptElement) {
    this.#promise = new Promise((resolve, reject): void => {
      const handleError = ({ error, filename, message }: ErrorEvent): void => {
        if (error instanceof Error) {
          reject(error);
          return;
        }

        reject(new Error(message, { cause: filename }));
      };

      try {
        script.addEventListener('error', handleError);
        script.addEventListener('load', (): void => {
          resolve();
        });
      } catch (err: unknown) {
        const error: Error = mapToError(err);
        reject(error);
      }
    });
  }

  public get [Symbol.toStringTag](): string {
    return this.#promise[Symbol.toStringTag];
  }

  public then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.#promise.then(onfulfilled, onrejected);
  }

  public catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<unknown> {
    return this.#promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | null): Promise<unknown> {
    return this.#promise.finally(onfinally);
  }
}
