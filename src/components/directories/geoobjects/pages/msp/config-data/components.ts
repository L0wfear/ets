/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "msp" *//* 'components/directories/geoobjects/pages/msp/MSPDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/msp/MSPDirectory';

export default [
  {
    component,
  },
];
