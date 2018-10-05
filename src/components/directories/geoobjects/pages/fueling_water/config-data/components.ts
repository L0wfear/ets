/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fueling_water" *//* 'components/directories/geoobjects/pages/fueling_water/FuelingWaterStationsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/fueling_water/FuelingWaterStationsDirectory';

export default [
  {
    component,
  },
];
