/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "car_types" *//* 'components/directories/autobase/car_types/CarTypesDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/autobase/car_types/CarTypesDirectory';

export default [
  {
    component,
  },
];