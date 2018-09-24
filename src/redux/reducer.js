import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';
import { etsLoading } from 'redux/_middleware/etsLoading';

import rootReducers from 'components/redux/reducer';

import owners from 'redux/modules/owners';
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
  owners,
  loading: loadingReducer,
  etsLoading,
  settings,
  session,
  monitorPage,
  types,
  paginator,
});

