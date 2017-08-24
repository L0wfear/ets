import React from 'react';
import { Route } from 'react-router';

import * as directories from './index.js';

const geoobjectRoutes = (props) => {
  const { requireAuth } = props;
  const routes = (
    <div>
      {/* НСИ - Реестры и справочники - Геоинструментарий */}
      <Route path="odh" component={directories.odh} onEnter={requireAuth} />
      <Route path="bridges" component={directories.bridges} onEnter={requireAuth} />
      <Route path="pedestrian-tunnels" component={directories.pedestrian_tunnels} onEnter={requireAuth} />
      <Route path="pedestrian-tunnel-exits" component={directories.pedestrian_tunnel_exits} onEnter={requireAuth} />
      <Route path="dt" component={directories.dt} onEnter={requireAuth} />
      <Route path="ssp" component={directories.ssp} onEnter={requireAuth} />
      <Route path="msp" component={directories.msp} onEnter={requireAuth} />
      <Route path="pgm" component={directories.pgm} onEnter={requireAuth} />
      <Route path="snow-storage" component={directories.snowStorage} onEnter={requireAuth} />
      <Route path="fueling-water" component={directories.fuelingWater} onEnter={requireAuth} />
      <Route path="carpool" component={directories.carpool} onEnter={requireAuth} />
      <Route path="danger-zones" component={directories.dangerZones} onEnter={requireAuth} />
    </div>
  );

  return routes;
};

geoobjectRoutes.propTypes = {
  requireAuth: React.PropTypes.func,
};


export default geoobjectRoutes;
