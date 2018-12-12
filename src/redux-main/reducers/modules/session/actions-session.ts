import { getFullAccess } from 'api/mocks/permissions';
import {
  SESSION_SET_DATA,
  SESSION_RESET_DATA,
  SESSION_SET_CONFIG,
} from 'redux-main/reducers/modules/session/session';

import { ConfigService } from 'api/Services';
import { CONFIG_INITIAL } from 'redux-main/reducers/modules/session/session';

export const withSpecificPermissions = (user) => {
  const permissions = [];

  if (user.login === 'gormost') {
    permissions.push(...getFullAccess('bridges'));
    permissions.push(...getFullAccess('pedestrian_tunnels'));
    permissions.push(...getFullAccess('pedestrian_tunnel_exits'));
    permissions.push(...getFullAccess('fountains'));
  }
  if (user.permissions.includes('pgm.list')) {
    permissions.push('pgm_store.list');
  }
  if (user.permissions.includes('pgm.read')) {
    permissions.push('pgm_store.read');
  }

  return permissions;
};

export const sessionSetAppConfig = () => ({
  type: SESSION_SET_CONFIG,
  payload: ConfigService.get()
    .catch((errorData) => {
      // tslint:disable-next-line
      console.warn(errorData);

      return CONFIG_INITIAL;
    })
    .then((appConfig) => ({
      appConfig,
    })),
  meta: {
    loading: true,
  },
});

export const sessionSetData = ({ currentUser, session }) => (dispatch) => {
  const userData = { ...currentUser };

  userData.permissions = [
    ...currentUser.permissions,
    ...withSpecificPermissions(currentUser),
  ];
  userData.permissionsSet = new Set(userData.permissions);

  userData.isOkrug = userData.okrug_id !== null;
  userData.isKgh = userData.permissionsSet.has('common.nsi_company_column_show');

  dispatch(
    sessionSetAppConfig(),
  );

  dispatch({
    type: SESSION_SET_DATA,
    payload: {
      token: session,
      userData,
    },
  });
};

export const sessionResetData = () => ({
  type: SESSION_RESET_DATA,
});
