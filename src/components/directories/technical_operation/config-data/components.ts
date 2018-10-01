import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "technical_operation" */ 'components/directories/technical_operation/TechnicalOperationsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
