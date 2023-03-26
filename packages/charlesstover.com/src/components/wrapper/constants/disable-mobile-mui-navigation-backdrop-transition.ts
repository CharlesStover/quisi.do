import isUndefined from '../../../utils/is-undefined';

// https://github.com/mui-org/material-ui/blob/1d4f91e85eb5027d2b9817b04d768fdf54568229/docs/src/modules/components/AppNavDrawer.js#L153-L156

// iOS is hosted on high-end devices. We can enable the backdrop transition
//   without dropping frames. The performance will be good enough.
const DISABLE_MOBILE_MUI_NAVIGATION_BACKDROP_TRANSITION: boolean =
  isUndefined(navigator) || !/iPad|iPhone|iPod/.test(navigator.userAgent);

export default DISABLE_MOBILE_MUI_NAVIGATION_BACKDROP_TRANSITION;
