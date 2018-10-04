import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "tire" */ 'components/directories/autobase/tire/TireList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
