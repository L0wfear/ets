import React from 'react';
import { Route } from 'react-router-dom';

import geoobjectRoutes from 'components/directories/geoobjects/indexRoute';
import repairRoutes from 'components/directories/repair/indexRoute';
import * as directories from './index.js';


const nsiRoutes = props => [
  <Route path="/employees" component={directories.employees} />,
  <Route path="/orders" component={directories.order} />,
  <Route path="/orders/:idOrder" component={directories.order} />,
  <Route path="/fuel-rates" component={directories.fuelRates} />,
  <Route path="/fuel-operations" component={directories.fuelOperations} />,
  <Route path="/companies" component={directories.organizations} />,
  <Route path="/technical-operations" component={directories.technicalOperations} />,
  <Route path="/car-func-types" component={directories.carTypes} />,
  <Route path="/cars" component={directories.cars} />,
  <Route path="/battery-registry" component={directories.autobase.batteryReg} />,
  <Route path="/battery-brand" component={directories.autobase.batteryBrand} />,
  <Route path="/battery-manufacturer" component={directories.autobase.batteryManufacturer} />,
  <Route path="/tire" component={directories.autobase.tire} />,
  <Route path="/tire" component={directories.autobase.tire} />,
  <Route path="/tire-model" component={directories.autobase.tireModel} />,
  <Route path="/tech-maintenance-order-registry" component={directories.autobase.techMaintOrder} />,
  <Route path="/spare-part" component={directories.autobase.sparePart} />,
  <Route path="/tech-inspection" component={directories.autobase.techInspection} />,
  <Route path="/insurance-policy" component={directories.autobase.insurancePolicy} />,
  <Route path="/repair-company" component={directories.autobase.repairCompany} />,
  <Route path="/odh-norm" component={directories.odhNorm} />,
  <Route path="/material-consumption-rate" component={directories.materialConsumptionRate} />,
  <Route path="/odh-norm-data-summer" component={directories.odhNormDataSummer} />,
  <Route path="/efficiency" component={directories.efficiency} />,
  <Route path="/maintenance-work" component={directories.maintenanceWork} />,
  <Route path="/medical-stats" component={directories.medicalStats} />,
  <Route path="/cleaning-rate" component={directories.cleaningRate} />,
  <Route path="/maintenance-rate" component={directories.maintenanceRate} />,
  <Route path="/user-action-log" component={directories.userActionLog} />,
  ...geoobjectRoutes(props),
  ...repairRoutes(props),
];

export default nsiRoutes;
