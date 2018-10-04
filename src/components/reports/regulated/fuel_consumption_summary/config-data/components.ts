import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fuel_consumption_summary" */ 'components/reports/regulated/fuel_consumption_summary/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];