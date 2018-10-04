import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "efficiency" */ 'components/directories/data_for_calculation/efficiency/EfficiencyList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
