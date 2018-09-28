import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "odh" */ 'components/directories/geoobjects/pages/odh/ODHDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
