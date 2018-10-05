/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "dt" *//* 'components/directories/geoobjects/pages/dt/DTDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/dt/DTDirectory';

export default [
  {
    component,
  },
];
