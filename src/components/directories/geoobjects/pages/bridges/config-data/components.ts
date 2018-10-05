/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "bridges" *//* 'components/directories/geoobjects/pages/bridges/BridgeDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/bridges/BridgeDirectory';

export default [
  {
    component,
  },
];
