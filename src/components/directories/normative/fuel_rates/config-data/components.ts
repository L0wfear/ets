/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fuel_rates" *//* 'components/directories/normative/fuel_rates/FuelRatesDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/normative/fuel_rates/FuelRatesDirectory';

export default [
  {
    component,
  },
];
