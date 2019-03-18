import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';
import { etsLoading } from 'redux-main/_middleware/etsLoading';

import reports from 'components/reports/redux-main/reducer';

import order from 'redux-main/reducers/modules/order/order';
import session from 'redux-main/reducers/modules/session/session';
import monitorPage from 'components/monitor/redux-main/models/monitor-page';
import dashboard from 'components/new/pages/dashboard/redux-main/modules/dashboard/dashboard';

import registry from 'components/new/ui/registry/module/registry';

// Easy move to redux
import userNotifications from 'redux-main/reducers/modules/user_notifications/user_notifications';
import old_report from 'components/coverage_reports/redux-main/modules/old-report/old_report';
import autobase from 'redux-main/reducers/modules/autobase/autobase';
import fuelRates from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import maintenanceRate from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';
import employee from 'redux-main/reducers/modules/employee/employee';
import company_structure from 'redux-main/reducers/modules/company_structure/company_structure';
import routes from 'redux-main/reducers/modules/routes/routes';
import some_uniq from 'redux-main/reducers/modules/some_uniq/some_uniq';
import geoobject from 'redux-main/reducers/modules/geoobject/geoobject';
import missions from 'redux-main/reducers/modules/missions';
import company from 'redux-main/reducers/modules/company';
import repairProgramm from 'redux-main/reducers/modules/repair/repair_programm_reducer';
import materialConsumptionRate from 'redux-main/reducers/modules/material_consumption_rate/materialConsumptionRate';
import inspect from 'redux-main/reducers/modules/inspect/inspect_reducer';

export default combineReducers({
  reports,
  dashboard,
  loading: loadingReducer,
  etsLoading,
  order,
  session,
  monitorPage,
  registry,
  userNotifications,
  old_report,
  autobase,
  fuelRates,
  employee,
  company_structure,
  routes,
  some_uniq,
  geoobject,
  maintenanceRate,
  missions,
  company,
  repairProgramm,
  materialConsumptionRate,
  inspect,
});
