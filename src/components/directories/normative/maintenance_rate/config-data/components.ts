import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "maintenance_rate" */ 'components/directories/normative/maintenance_rate/MaintenanceRateDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
