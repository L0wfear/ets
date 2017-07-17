import React from 'react';
import { Route } from 'react-router';

import * as directories from './index.js';

const nsiRoutes = (props) => {
  const { requireAuth } = props;
  const routes = (
    <div>
      {/* НСИ - Реестры и справочники */}
      <Route path="employees" component={directories.employees} onEnter={requireAuth} />
      <Route path="faxogramms" component={directories.faxogramm} onEnter={requireAuth} />
      <Route path="fuel-rates" component={directories.fuelRates} onEnter={requireAuth} />
      <Route path="fuel-operations" component={directories.fuelOperations} onEnter={requireAuth} />
      <Route path="companies" component={directories.organizations} onEnter={requireAuth} />
      <Route path="technical-operations" component={directories.technicalOperations} onEnter={requireAuth} />
      <Route path="car-func-types" component={directories.carTypes} onEnter={requireAuth} />
      <Route path="cars" component={directories.cars} onEnter={requireAuth} />
      <Route path="battery-registry" component={directories.autobase.batteryReg} onEnter={requireAuth} />
      <Route path="battery-brand" component={directories.autobase.batteryBrand} onEnter={requireAuth} />
      <Route path="battery-manufacturer" component={directories.autobase.batteryManufacturer} onEnter={requireAuth} />
      <Route path="tire" component={directories.autobase.tire} onEnter={requireAuth} />
      <Route path="spare-part" component={directories.autobase.sparePart} onEnter={requireAuth} />
      <Route path="odh-norm" component={directories.odhNorm} onEnter={requireAuth} />
      <Route path="material-consumption-rate" component={directories.materialConsumptionRate} onEnter={requireAuth} />
      <Route path="odh-norm-data-summer" component={directories.odhNormDataSummer} onEnter={requireAuth} />
      <Route path="efficiency" component={directories.efficiency} onEnter={requireAuth} />
      <Route path="maintenance-work" component={directories.maintenanceWork} onEnter={requireAuth} />
      <Route path="medical-stats" component={directories.medicalStats} onEnter={requireAuth} />
      <Route path="cleaning-rate" component={directories.cleaningRate} onEnter={requireAuth} />
      <Route path="maintenance-rate" component={directories.maintenanceRate} onEnter={requireAuth} />
      <Route path="user-action-log" component={directories.userActionLog} onEnter={requireAuth} />
      {/* НСИ - Реестры и справочники - Геоинструментарий */}
      <Route path="odh" component={directories.geoobjects.odh} onEnter={requireAuth} />
      <Route path="dt" component={directories.geoobjects.dt} onEnter={requireAuth} />
      <Route path="ssp" component={directories.geoobjects.ssp} onEnter={requireAuth} />
      <Route path="msp" component={directories.geoobjects.msp} onEnter={requireAuth} />
      <Route path="pgm" component={directories.geoobjects.pgm} onEnter={requireAuth} />
      <Route path="snow-storage" component={directories.geoobjects.snowStorage} onEnter={requireAuth} />
      <Route path="fueling-water" component={directories.geoobjects.fuelingWater} onEnter={requireAuth} />
      <Route path="carpool" component={directories.geoobjects.carpool} onEnter={requireAuth} />
      <Route path="danger-zones" component={directories.geoobjects.dangerZones} onEnter={requireAuth} />
    </div>
  );

  return routes;
};

nsiRoutes.propTypes = {
  requireAuth: React.PropTypes.func,
};


export default nsiRoutes;
