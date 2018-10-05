/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "snow_storage" *//* 'components/directories/geoobjects/pages/snow_storage/SnowStorageDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/snow_storage/SnowStorageDirectory';

export default [
  {
    component,
  },
];
