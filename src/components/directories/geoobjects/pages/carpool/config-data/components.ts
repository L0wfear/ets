import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "carpool" */ 'components/directories/geoobjects/pages/carpool/CarpoolDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
