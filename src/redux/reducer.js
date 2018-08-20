import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import rootReducers from 'components/redux/reducer';

import owners from 'redux/modules/owners';
import settings from 'redux/modules/settings';
import session from 'redux/modules/session/session';
import monitorPage from 'components/monitor/new/redux/models/monitor-page';

export default combineReducers({
  ...rootReducers,
  owners,
  loading: loadingReducer,
  settings,
  session,
  monitorPage,
});

