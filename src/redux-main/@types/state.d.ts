import { InitialStateDashboard } from 'components/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import { InitialStateTypeRegistry } from 'components/new/ui/registry/module/registry';
import { IStateReport } from 'components/reports/redux-main/modules/report';
import { IStateUserNotifications } from 'redux-main/reducers/modules/user_notifications/@types/user_notifications.h';

export interface ReduxState {
  dashboard: InitialStateDashboard;
  registry: InitialStateTypeRegistry;
  report: IStateReport;
  userNotifications: IStateUserNotifications;
  [key: string]: any;
}
