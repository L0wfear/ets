/**
 * @module actions
 * Flummox actions
 */
import cars from './CarActions.js';
import companyStructure from './CompanyStructureActions.js';
import dashboard from './DashboardActions.js';
import employees from './EmployeesActions.js';
import fuelRates from './FuelRateActions.js';
import missions from './MissionsActions.js';
import objects from './ObjectsActions.js';
import points from './PointsActions.js';
import reports from './ReportsActions.js';
import routes from './RoutesActions.js';
import session from './SessionActions.js';
import settings from './SettingsActions.js';
import technicalOperation from './TechnicalOperationsActions.js';
import waybills from './WaybillsActions.js';
import geoObjects from './GeoObjectsActions.js';
import odh from './ODHActions.js';
import autobase from './AutobaseAction.js';
// NOTE CI не подхватывает изменения в названии модуля файла UserNotificationActions
import userNotifications from './UserNotificationActions';

export {
  cars,
  odh,
  companyStructure,
  dashboard,
  employees,
  fuelRates,
  missions,
  objects,
  points,
  reports,
  routes,
  session,
  settings,
  technicalOperation,
  waybills,
  geoObjects,
  autobase,
  userNotifications,
};
