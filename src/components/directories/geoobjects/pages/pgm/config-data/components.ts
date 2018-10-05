/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "pgm" *//* 'components/directories/geoobjects/pages/pgm/PGMDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/pgm/PGMDirectory';

export default [
  {
    component,
  },
];
