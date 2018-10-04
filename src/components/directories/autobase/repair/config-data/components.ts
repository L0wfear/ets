import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "hidden_repair" */ 'components/directories/autobase/repair/RepairList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
