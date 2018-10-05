/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "danger_zones" *//* 'components/directories/geoobjects/pages/danger_zones/DangerZonesDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/danger_zones/DangerZonesDirectory';

export default [
  {
    component,
  },
];
