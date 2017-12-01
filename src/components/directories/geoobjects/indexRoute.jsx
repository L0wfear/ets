import React from 'react';
import { Route } from 'react-router-dom';

import * as directories from './index.js';

const geoobjectRoutes = props => [
  <Route path="/odh" component={directories.odh} />,
  <Route path="/bridges" component={directories.bridges} />,
  <Route path="/pedestrian-tunnels" component={directories.pedestrian_tunnels} />,
  <Route path="/pedestrian-tunnel-exits" component={directories.pedestrian_tunnel_exits} />,
  <Route path="/fountains" component={directories.fountains} />,
  <Route path="/dt" component={directories.dt} />,
  <Route path="/ssp" component={directories.ssp} />,
  <Route path="/msp" component={directories.msp} />,
  <Route path="/pgm" component={directories.pgm} />,
  <Route path="/snow-storage" component={directories.snowStorage} />,
  <Route path="/fueling-water" component={directories.fuelingWater} />,
  <Route path="/carpool" component={directories.carpool} />,
  <Route path="/danger-zones" component={directories.dangerZones} />,
];

export default geoobjectRoutes;
