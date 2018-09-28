import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "pedestrian_tunnels" */ 'components/directories/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
