import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';
import { etsLoading } from 'redux-main/_middleware/etsLoading';

import rootReducers from 'components/redux-main/reducer';

import order from 'redux-main/reducers/modules/order/order';
import session from 'redux-main/reducers/modules/session/session';
import monitorPage from 'components/monitor/redux-main/models/monitor-page';
import dashboard from 'components/dashboard/redux-main/modules/dashboard/dashboard';

import registry from 'components/new/ui/registry/module/registry';

// Easy move to redux
import userNotifications from 'redux-main/reducers/modules/user_notifications/user_notifications';

export default combineReducers({
  ...rootReducers,
  dashboard,
  loading: loadingReducer,
  etsLoading,
  order,
  session,
  monitorPage,
  registry,
  userNotifications,
});
