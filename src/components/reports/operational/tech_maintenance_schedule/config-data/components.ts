/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "tech_maintenance_schedule" *//* 'components/reports/operational/tech_maintenance_schedule/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/tech_maintenance_schedule/report';

export default [
  {
    component,
  },
];
