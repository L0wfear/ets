/**
 * @module directories
 * Реестры и справочники
 */
import carTypes from './car_types/CarTypesDirectory.jsx';
import cars from './cars/CarsList.jsx';
import employees from './employees/EmployeesList.jsx';
import faxogramm from './faxogramm/FaxogrammDirectory.jsx';
import fuelOperations from './fuel_operations/FuelOperationsDirectory.jsx';
import fuelRates from './fuel_rates/FuelRatesDirectory.jsx';
import odhNorm from './odh_norm/ODHNormList.jsx';
import maintenanceWork from './maintenance_work/MaintenanceWorkDirectory.jsx';
import materialConsumptionRate from './material_consumption_rate/MaterialConsumptionRateDirectory.jsx';
import odhNormDataSummer from './odh_norm_data_summer/ODHNormDataSummerList.jsx';
import efficiency from './efficiency/EfficiencyList.jsx';
import organizations from './organizations/OrganizationsDirectory.jsx';
import technicalOperations from './technical_operation/TechnicalOperationsDirectory.jsx';
import * as geoobjects from './geoobjects';

export {
  carTypes,
  cars,
  employees,
  faxogramm,
  odhNorm,
  odhNormDataSummer,
  efficiency,
  maintenanceWork,
  materialConsumptionRate,
  fuelOperations,
  fuelRates,
  organizations,
  technicalOperations,
  geoobjects,
};
