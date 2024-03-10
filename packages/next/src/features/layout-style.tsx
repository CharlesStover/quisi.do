import type { ReactElement } from 'react';

const BODY_FONT_FAMILIES: readonly string[] = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  '"Open Sans"',
  '"Helvetica Neue"',
  'Helvetica',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

const LAYOUT_CSS = `
body {
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  -ms-text-size-adjust: none;
  -webkit-font-feature-settings: "pnum";
  -webkit-font-smoothing: antialiased;
  -webkit-overflow-scrolling: touch;
  -webkit-text-size-adjust: none;
  box-sizing: border-box;
  color: #000000;
  font-family: ${BODY_FONT_FAMILIES.join(', ')};
  font-feature-settings: "pnum";
  font-size: 16px;
  font-smooth: always;
  font-variant-numeric: proportional-nums;
  letter-spacing: 0;
  line-height: 1.5;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  min-height: 100%;
  overflow-y: scroll;
  padding-bottom: 0;
  padding-top: 0;
  text-rendering: optimizeLegibility;
  text-size-adjust: none;

  @media (max-width: 6in) {
    padding-left: 0.5in;
    padding-right: 0.5in;
  }

  @media (min-width: 6in) {
    padding-left: 1in;
    padding-right: 1in;
  }

  /*
  @media (prefers-color-scheme: dark) {
    background-color: #202020;
    color: #ffffff;
  }
  */
}
`;

export default function LayoutStyle(): ReactElement {
  return (
    <style
      type="text/css"
      dangerouslySetInnerHTML={{
        __html: LAYOUT_CSS,
      }}
    />
  );
}
