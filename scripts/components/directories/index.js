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
import odhSupportStandards from './odh_support_standards/ODHSupportStandardsList.jsx'
import odhSupportStandardsDataSummer from './odh_support_standards_data_summer/ODHSupportStandardsDataSummerList.jsx'
import organizations from './organizations/OrganizationsDirectory.jsx';
import technicalOperations from './technical_operation/TechnicalOperationsDirectory.jsx';
import geoobjects from './geoobjects';

export default {
  carTypes,
  cars,
  employees,
  faxogramm,
  odhSupportStandards,
  odhSupportStandardsDataSummer,
  fuelOperations,
  fuelRates,
  organizations,
  technicalOperations,
  geoobjects
}
