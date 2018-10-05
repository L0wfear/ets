/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fuel_operations" *//* 'components/directories/data_for_calculation/fuel_operations/FuelOperationsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/data_for_calculation/fuel_operations/FuelOperationsDirectory';

export default [
  {
    component,
  },
];
