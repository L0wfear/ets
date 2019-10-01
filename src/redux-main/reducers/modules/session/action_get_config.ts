import { get } from 'lodash';
import {
  SESSION_SET_CONFIG,
  CONFIG_INITIAL,
  SESSION_SET_TRACK_CONFIG,
  TRACK_CONFIG_INITIAL,
} from 'redux-main/reducers/modules/session/session';

import { ConfigService, ConfigTrackService } from 'api/Services';
import { InitialStateSession } from './@types/session';
import config from 'config';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

const actionSetAppConfig = (appConfig: InitialStateSession['appConfig']) => ({
  type: SESSION_SET_CONFIG,
  payload: {
    appConfig,
  },
});

export const actionSetAppConfigTracksCaching = (appConfigTracksCaching: InitialStateSession['appConfigTracksCaching']) => ({
  type: SESSION_SET_TRACK_CONFIG,
  payload: {
    appConfigTracksCaching,
  },
});

export const actionLoadAppConfig = () => async (dispatch) => {
  let appConfig: InitialStateSession['appConfig'] = null;

  try {
    appConfig = await ConfigService.get();
  } catch (error) {
    appConfig = CONFIG_INITIAL;
  }

  dispatch(
    actionSetAppConfig(appConfig),
  );

  return appConfig;
};

const setVersionInLocalStorage = (appConfigTracksCaching: InitialStateSession['appConfigTracksCaching']) => {
  const { api_version_stable } = appConfigTracksCaching;

  let versions = JSON.parse(localStorage.getItem(global.API__KEY) || '{}');
  if (!versions) {
    versions = {};
  }

  const versionFromLocalStorage = Number(
    get(
      JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
      config.tracksCaching,
      '',
    ),
  );
  if (versionFromLocalStorage !== api_version_stable) {
    console.log(`API SET VERSION ${config.tracksCaching}`, api_version_stable); // tslint:disable-line:no-console

    versions[config.tracksCaching] = api_version_stable.toString();
  }

  localStorage.setItem(global.API__KEY, JSON.stringify(versions));
};

export const actionLoadAppConfigTracksCaching = (): EtsAction<Promise<InitialStateSession['appConfigTracksCaching']>> => async (dispatch) => {
  let appConfigTracksCaching = null;

  try {
    appConfigTracksCaching = await ConfigTrackService.get();
  } catch (e) {
    appConfigTracksCaching = TRACK_CONFIG_INITIAL;
  }
  setVersionInLocalStorage(appConfigTracksCaching);

  dispatch(
    actionSetAppConfigTracksCaching(appConfigTracksCaching),
  );

  return appConfigTracksCaching;
};
