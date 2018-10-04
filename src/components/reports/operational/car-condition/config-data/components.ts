import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "car_condition" */ 'components/reports/operational/car-condition/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];