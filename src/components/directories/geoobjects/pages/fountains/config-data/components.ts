import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "fountains" */ 'components/directories/geoobjects/pages/fountains/FountainsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
