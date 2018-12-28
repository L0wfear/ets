import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateTypeRegistry } from 'components/new/ui/registry/module/registry';
import { IStateReport } from 'components/reports/redux-main/modules/report';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { IStateOldReport } from 'components/coverage_reports/redux-main/modules/old-report/@types/old_report';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/routes.h';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

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

  monitorPage: any;
  loading: any;
  etsLoading: any;
}
