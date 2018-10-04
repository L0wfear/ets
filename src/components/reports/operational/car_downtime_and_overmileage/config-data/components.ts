import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "car_downtime_and_overmileage" */ 'components/reports/operational/car_downtime_and_overmileage/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];