/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "pedestrian_tunnel_exits" *//* 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsDirectory';

export default [
  {
    component,
  },
];
