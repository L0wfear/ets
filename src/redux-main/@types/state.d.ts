import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateTypeRegistry } from 'components/new/ui/registry/module/registry';
import { IStateReport } from 'components/reports/redux-main/modules/report';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';
import { IStateOldReport } from 'components/coverage_reports/redux-main/modules/old-report/@types/old_report';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export interface ReduxState {
  dashboard: InitialStateDashboard;
  registry: InitialStateTypeRegistry;
  report: IStateReport;
  userNotifications: IStateUserNotifications;
  old_report: IStateOldReport;
  session: InitialStateSession;
  autobase: IStateAutobase;
  [key: string]: any;
}
