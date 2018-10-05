/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "maintenance_work" *//* 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkDirectory';

export default [
  {
    component,
  },
];
