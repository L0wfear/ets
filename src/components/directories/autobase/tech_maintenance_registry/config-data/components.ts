import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "tech_maintenance_registry" */ 'components/directories/autobase/tech_maintenance_registry/TechMaintList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
