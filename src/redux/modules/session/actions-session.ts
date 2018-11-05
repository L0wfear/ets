import { getFullAccess } from 'api/mocks/permissions';
import {
  SESSION_SET_DATA,
  SESSION_RESET_DATA,
} from 'redux/modules/session/session';

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

export const sessionSetData = ({ currentUser, session }) => {
  const userData = { ...currentUser };

  userData.permissions = [
    ...currentUser.permissions,
    ...withSpecificPermissions(currentUser),
  ];

  userData.isOkrug = userData.okrug_id !== null;
  userData.isKgh = userData.permissions.includes('common.nsi_company_column_show');

  return {
    type: SESSION_SET_DATA,
    payload: {
      userData,
      token: session,
    },
  };
}

export const sessionResetData = () => ({
  type: SESSION_RESET_DATA,
});
