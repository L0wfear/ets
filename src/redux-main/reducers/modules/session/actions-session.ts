import {
  SESSION_SET_DATA,
  SESSION_RESET_DATA,
  SESSION_SET_TRACK_CONFIG,
} from 'redux-main/reducers/modules/session/session';
import User from 'models/User';

import {
  AuthService,
  ChangeRoleService,
  ConfigTrackService,
  AuthCheckService,
} from 'api/Services';

import { TRACK_CONFIG_INITIAL } from 'redux-main/reducers/modules/session/session';
import config from 'config';
import { get } from 'lodash';
import { setUserContext } from 'config/raven';
import { isObject } from 'util';
import { makeUserData } from './utils';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { sessionSetAppConfig } from './action_get_config';

export const sessionGetTracksCachingAppConfig = () => ({
  type: SESSION_SET_TRACK_CONFIG,
  payload: ConfigTrackService.get()
    .catch((errorData) => {
      // tslint:disable-next-line
      console.error(errorData);

      return TRACK_CONFIG_INITIAL;
    })
    .then((appConfigTracksCaching) => ({
      appConfigTracksCaching,
    })),
  meta: {
    promise: true,
  },
});

export const sessionCahngeCompanyOnAnother: any = (
  company_id,
  { page, path },
) => async (dispatch) => {
  const {
    payload: { payload: userDataRaw, token },
  } = await dispatch({
    type: 'none',
    payload: ChangeRoleService.post({ company_id }, false, 'json'),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  const userData = makeUserData(userDataRaw);

  dispatch(sessionSetData(userData, token));

  return {
    userData,
    token,
  };
};

export const sessionLogin: any = (user, { page, path }) => async (dispatch) => {
  const {
    payload: { payload: userDataRaw, token },
  } = await dispatch({
    type: 'none',
    payload: AuthService.post(user, false, 'json'),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  // calc stableRedirect
  const userData = makeUserData(userDataRaw);

  await dispatch(sessionSetData(userData, token));

  return {
    userData,
    token,
  };
};

export const sessionSetData: any = (userData, session) => async (dispatch) => {
  localStorage.setItem(global.SESSION_KEY2, JSON.stringify(session));

  setUserContext(userData);

  await Promise.all([
    dispatch(sessionSetAppConfig()),
    dispatch(sessionLoadTracksCachingConfig()),
    dispatch(
      someUniqActions.actionGetAndSetInStoreMissionSource(
        {},
        { page: 'mainpage' },
      ),
    ),
  ]);

  return dispatch({
    type: SESSION_SET_DATA,
    payload: {
      token: session,
      userData: new User(userData),
    },
  });
};

export const sessionLoadTracksCachingConfig: any = () => async (dispatch) => {
  const {
    payload: { appConfigTracksCaching },
  } = await dispatch(sessionGetTracksCachingAppConfig());

  const { api_version_stable } = appConfigTracksCaching;
  let versions = JSON.parse(localStorage.getItem(global.API__KEY2) || '{}');
  if (!versions) {
    versions = {};
  }

  const versionFromLocalStorage = Number(
    get(
      JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
      config.tracksCaching,
      '',
    ),
  );
  if (versionFromLocalStorage !== api_version_stable) {
    console.log(`API SET VERSION ${config.tracksCaching}`, api_version_stable); // tslint:disable-line:no-console

    versions[config.tracksCaching] = api_version_stable.toString();
  }

  localStorage.setItem(global.API__KEY2, JSON.stringify(versions));
};

export const checkToken: any = () => async (dispatch, getState) => {
  const {
    payload: { data },
  } = await dispatch({
    type: 'none',
    payload: AuthCheckService.get(),
    meta: {
      promise: true,
    },
  });

  if (isObject(data) && Object.keys(data).length) {
    dispatch(
      sessionSetData(
        makeUserData(data),
        JSON.parse(localStorage.getItem(global.SESSION_KEY2)),
      ),
    );

    return data;
  } else {
    dispatch(sessionResetData());
  }

  return null;
};

export const sessionResetData: any = () => (dispatch) => {
  localStorage.removeItem(global.SESSION_KEY2);
  localStorage.removeItem(global.API__KEY2);
  localStorage.removeItem('featureBufferPolygon');

  dispatch({
    type: SESSION_RESET_DATA,
  });
};
