export default interface IntercomFunction {
  // (event: 'getVisitorId'): string;
  (event: 'onHide' | 'onShow', callback: VoidFunction): void;
  (event: 'onUnreadCountChange', callback: (unreadCount: number) => void): void;
  (event: 'showNewMessages', prePopulatedContent?: string): void;
  (event: 'startTour', tourId: number): void;
  (
    event: 'boot',
    settings: Readonly<Record<string, number | string | undefined>>,
  ): void;
  (
    event: 'hide' | 'reattach_activator' | 'show' | 'showMessages' | 'shutdown',
  ): void;
  (
    event: 'trackEvent',
    eventName: string,
    metadata?: Record<string, string>,
  ): void;
  (
    event: 'update',
    settings?: Readonly<Record<string, number | string | undefined>>,
  ): void;

  // Method `c` and property `q` are defined by Intercom.
  c: (args: readonly unknown[]) => void;
  q: (readonly unknown[])[];
}
