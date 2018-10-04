import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "tire_model" */ 'components/directories/autobase/tire_model/TireModelList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
