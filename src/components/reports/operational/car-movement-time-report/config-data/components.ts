/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "car_movement_time_report" *//* 'components/reports/operational/car-movement-time-report/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/car-movement-time-report/report';

export default [
  {
    component,
  },
];
