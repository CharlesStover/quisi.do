import type { Handler } from '@quisido/worker';

export default function handleLog(
  this: Handler,
  ...messages: readonly string[]
): void {
  this.console.log(...messages);
}
