import type { Handler } from '@quisido/worker';

export default function handleError(this: Handler, err: Error): void {
  this.console.error(err.message, err.cause, err.stack);
}
