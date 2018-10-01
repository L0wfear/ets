import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "material_consumption_rate" */ 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
