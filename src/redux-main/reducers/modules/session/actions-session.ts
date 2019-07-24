import {
  SESSION_SET_DATA,
  SESSION_RESET_DATA,
} from 'redux-main/reducers/modules/session/session';
import User from 'models/User';

import {
  AuthService,
  ChangeRoleService,
  AuthCheckService,
  AuthServiceEtsTest,
  ChangeRoleServiceEtsTest,
  AuthCheckServiceEtsTest,
} from 'api/Services';

import { setUserContext, initSentry } from 'config/raven';
import { isObject } from 'util';
import { makeUserData } from './utils';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { actionLoadAppConfig, actionLoadAppConfigTracksCaching } from './action_get_config';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

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

  let sessionEtsTest = null;

  if (process.env.STAND === 'gost_stage') {
    const {
      payload: { token: sessionEtsTestToken },
    } = await dispatch({
      type: 'none',
      payload: ChangeRoleServiceEtsTest.post({ company_id }, false, 'json'),
      meta: {
        promise: true,
        page,
        path,
      },
    });

    sessionEtsTest = sessionEtsTestToken;
  }

  const userData = makeUserData(userDataRaw);

  dispatch(sessionSetData(userData, token, sessionEtsTest));

  return {
    userData,
    token,
  };
};

export const sessionLogin = (user: { login: string; password: string }, meta: LoadingMeta) => async (dispatch) => {
  const { payload: userDataRaw, token } = await etsLoadingCounter(
    dispatch,
    AuthService.post(user, false, 'json'),
    meta,
  );

  let sessionEtsTest = '';

  if (process.env.STAND === 'gost_stage') {
    const { token: sessionEtsTestToken } = await etsLoadingCounter(
      dispatch,
      AuthServiceEtsTest.post(user, false, 'json'),
      meta,
    );

    sessionEtsTest = sessionEtsTestToken;
  }

  // calc stableRedirect
  const userData = makeUserData(userDataRaw);

  await dispatch(sessionSetData(userData, token, sessionEtsTest));

  return userData;
};

export const sessionSetData: any = (
  userData,
  session,
  sessionEtsTest,
) => async (dispatch) => {
  localStorage.setItem(global.SESSION_KEY, JSON.stringify(session));

  if (process.env.STAND === 'gost_stage') {
    localStorage.setItem(
      global.SESSION_KEY_ETS_TEST_BY_DEV,
      JSON.stringify(sessionEtsTest),
    );
  }

  const [appConfig] = await Promise.all([
    dispatch(actionLoadAppConfig()),
    dispatch(actionLoadAppConfigTracksCaching()),
    dispatch(
      someUniqActions.actionGetAndSetInStoreMissionSource(
        {},
        { page: 'mainpage' },
      ),
    ),
  ]);

  initSentry(appConfig.env);

  setUserContext(userData);

  return dispatch({
    type: SESSION_SET_DATA,
    payload: {
      token: session,
      userData: new User(userData),
    },
  });
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

  let sessionEtsTest = '';

  let triggreOnSave = (
    isObject(data)
    && Boolean(Object.keys(data).length)
  );

  if (process.env.STAND === 'gost_stage') {
    let tokenString = localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV);
    if (tokenString === 'undefined') {
      tokenString = null;
    }
    sessionEtsTest = JSON.parse(
      tokenString,
    );

    if (tokenString) {
      const { data: dataEtsTest } = await etsLoadingCounter(
        dispatch,
        AuthCheckServiceEtsTest.get(),
        {
          page: 'mainpage', path: '',
        },
      );

      triggreOnSave = (
        triggreOnSave
        && Boolean(sessionEtsTest) && sessionEtsTest !== 'undefined'
        && isObject(dataEtsTest)
        && Boolean(Object.keys(dataEtsTest).length)
      );
    } else {
      triggreOnSave = false;
    }
  }

  if (triggreOnSave) {
    dispatch(
      sessionSetData(
        makeUserData(data),
        JSON.parse(localStorage.getItem(global.SESSION_KEY)),
        sessionEtsTest,
      ),
    );

    return data;
  } else {
    dispatch(sessionResetData());
  }

  return null;
};

export const sessionResetData: any = () => (dispatch) => {
  // localStorage.removeItem(global.SESSION_KEY_ETS_TEST_BY_DEV);
  // localStorage.removeItem(global.SESSION_KEY);
  // localStorage.removeItem(global.API__KEY);
  // localStorage.removeItem('featureBufferPolygon');
  localStorage.clear();

  dispatch({
    type: SESSION_RESET_DATA,
  });
};
