import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fuel_consumption" */ 'components/reports/regulated/fuel_consumption/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];