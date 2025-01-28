import type { ReactElement } from 'react';

const SCRIPT = `
(function(w) {
  w.addEventListener = function addEventListenerSpy(type, listener, options) {
    if (type === 'unload') {
      Window.prototype.addEventListener.call(w, 'pagehide', listener, options);
      return;
    }
    Window.prototype.addEventListener.call(w, type, listener, options);
  };
})(window);
`;

export default function RocketLoaderHotfix(): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
      type="text/javascript"
    />
  );
}
