import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import rootReducers from 'components/redux/reducer';

import order from 'redux/modules/order/order.ts';
import settings from 'redux/modules/settings';
import session from 'redux/modules/session/session';
import monitorPage from 'components/monitor/new/redux/models/monitor-page';
import dashboard from 'components/dashboard/new/redux/modules/dashboard/dashboard';
// legacy
import types from 'redux/modules/types';

// sorry
import paginator from 'components/ui/new/paginator/redux/paginator';

export default combineReducers({
  ...rootReducers,
  dashboard,
  loading: loadingReducer,
  settings,
  order,
  session,
  monitorPage,
  types,
  paginator,
});

