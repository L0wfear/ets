import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';
import { etsLoading } from 'redux-main/_middleware/etsLoading';

import rootReducers from 'components/redux-main/reducer';

import order from 'redux-main/modules/order/order';
import session from 'redux-main/modules/session/session';
import monitorPage from 'components/monitor/new/redux-main/models/monitor-page';
import dashboard from 'components/dashboard/new/redux-main/modules/dashboard/dashboard';

// sorry
import paginator from 'components/ui/new/paginator/redux-main/paginator';

export default combineReducers({
  ...rootReducers,
  dashboard,
  loading: loadingReducer,
  etsLoading,
  order,
  session,
  monitorPage,
  paginator,
});
