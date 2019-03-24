import { getFullAccess } from 'api/mocks/permissions';
import {
  SESSION_SET_DATA,
  SESSION_RESET_DATA,
  SESSION_SET_CONFIG,
  SESSION_SET_TRACK_CONFIG,
} from 'redux-main/reducers/modules/session/session';

import config from 'config';
import { get } from 'lodash';

export const withSpecificPermissions = (user) => {
  const permissions = [];

  if (user.login === 'gormost') {
    permissions.push(...getFullAccess('bridges'));
    permissions.push(...getFullAccess('pedestrian_tunnels'));
    permissions.push(...getFullAccess('pedestrian_tunnel_exits'));
    permissions.push(...getFullAccess('fountains'));
  }

  permissions.push(...getFullAccess('docs_close_waybill'));
  permissions.push(...getFullAccess('docs_create_mission'));
  permissions.push(...getFullAccess('docs_close_mission'));
  permissions.push(...getFullAccess('docs_issue_a_waybill'));
  permissions.push(...getFullAccess('docs_create_mission_by_order'));
  permissions.push(...getFullAccess('docs_issue_a_waybill_without_mission'));

  user.permissions.forEach((permission) => {
    if (permission.match(/^pgm\./)) {
      permissions.push(
        permission.replace(/^pgm\./, 'pgm_store.'),
      );
    }
  });

  return permissions;
};

export const sessionSetAppConfig: any = (appConfig) => ({
  type: SESSION_SET_CONFIG,
  payload: {
    appConfig,
  },
});

export const sessionSetData: any = ({ currentUser, session }) => (dispatch) => {
  const userData = { ...currentUser };

  userData.permissions = [
    ...currentUser.permissions,
    ...withSpecificPermissions(currentUser),
  ];
  userData.permissionsSet = new Set(userData.permissions);

  userData.isOkrug = userData.okrug_id !== null;
  userData.isKgh = userData.permissionsSet.has('common.nsi_company_column_show');

  dispatch({
    type: SESSION_SET_DATA,
    payload: {
      token: session,
      userData,
    },
  });
};

export const sessionSetTracksCachingConfig: any = (appConfigTracksCaching) => (dispatch) => {
  const versionFromLocalStorage = Number(get(JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'), config.tracksCaching, ''));
  const { api_version_stable } = appConfigTracksCaching;

  if (versionFromLocalStorage !== api_version_stable) {
    console.log(`API SET VERSION ${config.tracksCaching}`, api_version_stable); // tslint:disable-line:no-console
    let versions = JSON.parse(localStorage.getItem(global.API__KEY2) || '{}');

    if (!versions) {
      versions = {};
    }
    versions[config.tracksCaching] = api_version_stable.toString();
    localStorage.setItem(global.API__KEY2, JSON.stringify(versions));
  }

  return dispatch({
    type: SESSION_SET_TRACK_CONFIG,
    payload: {
      appConfigTracksCaching,
    },
  });
};

export const sessionResetData = () => ({
  type: SESSION_RESET_DATA,
});
