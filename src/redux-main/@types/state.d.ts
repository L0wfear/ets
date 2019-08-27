import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateTypeRegistry } from 'components/new/ui/registry/module/@types/registry';
import { IStateReport } from 'components/old/reports/redux-main/modules/report';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { IStateOldReport } from 'components/old/coverage_reports/redux-main/modules/old-report/@types/old_report';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateGeoobject } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';
import { IStateFuelRates } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { IStateMaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';
import { IStateOrder } from 'redux-main/reducers/modules/order/@types';
import { IStateMaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import { IStateInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

export interface ReduxState {
  dashboard: InitialStateDashboard;
  registry: InitialStateTypeRegistry;
  report: IStateReport;
  userNotifications: IStateUserNotifications;
  old_report: IStateOldReport;
  session: InitialStateSession;
  autobase: IStateAutobase;
  employee: IStateEmployee;
  company_structure: IStateCompanyStructure;
  routes: IStateRoutes;
  some_uniq: IStateSomeUniq;
  geoobject: IStateGeoobject;
  missions: IStateMissions;
  company: IStateCompany;
  inspect: IStateInspect;

  order: IStateOrder; // partial

  monitorPage: IStateMonitorPage;
  loading: any;
  etsLoading: any;
  fuelRates: IStateFuelRates;
  maintenanceRate: IStateMaintenanceRate;
  materialConsumptionRate: IStateMaterialConsumptionRate;
  [key: string]: any;
}
