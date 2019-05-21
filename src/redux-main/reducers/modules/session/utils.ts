import createFio from 'utils/create-fio';
import { getFullAccess } from 'api/mocks/permissions';
import { userNotification } from 'api/mocks/permissions';

import requireAuth from 'utils/auth';

export const withSpecificPermissions = (user) => {
  const permissions = [];

  if (user.login === 'gormost') {
    permissions.push(...getFullAccess('bridges'));
    permissions.push(...getFullAccess('pedestrian_tunnels'));
    permissions.push(...getFullAccess('pedestrian_tunnel_exits'));
    permissions.push(...getFullAccess('fountains'));
  }
  /* docs */
  permissions.push(...getFullAccess('docs_close_waybill'));
  permissions.push(...getFullAccess('docs_create_mission'));
  permissions.push(...getFullAccess('docs_close_mission'));
  permissions.push(...getFullAccess('docs_issue_a_waybill'));
  permissions.push(...getFullAccess('docs_create_mission_by_order'));
  permissions.push(...getFullAccess('docs_issue_a_waybill_without_mission'));
  /* end docs */
  // permissions.push('administration');
  // permissions.push(...getFullAccess('services'));

  // permissions.push(...getFullAccess('odh_norm_data_summer'));
  // permissions.push(...getFullAccess('efficiency'));

  // permissions.push(...getFullAccess('inspect.autobase'));
  // permissions.push(...getFullAccess('inspect.container'));
  // permissions.push(...getFullAccess('inspect.pgm_base'));
  // permissions.push(...getFullAccess('inspect.cars_condition'));

  permissions.push(...getFullAccess('edc_request')); // <<< удалить перед выкатом!!!!!!
  // permissions.push(...getFullAccess('fuel_cards_report'));
  // permissions.push(...getFullAccess('track_events_report')); // <<< УДАЛИТЬ перед выкатом на дев

  user.permissions.forEach((permission) => {
    if (permission.match(/^pgm\./)) {
      permissions.push(permission.replace(/^pgm\./, 'pgm_store.'));
    }
  });
  return permissions;
};

export const makeUserData = (userDataRaw) => {
  const userData = { ...userDataRaw };

  userData.fio = createFio(userData);

  // Здесь можно вставлять моковые пермишины
  userData.permissions = [
    ...userDataRaw.permissions,
    ...userNotification,
    ...withSpecificPermissions(userDataRaw),
  ];
  userData.permissionsSet = new Set(userData.permissions);

  userData.isOkrug = userData.okrug_id !== null;
  userData.isKgh = userData.permissionsSet.has(
    'common.nsi_company_column_show',
  );
  userData.isGlavControl = userData.permissionsSet.has('role.change');

  const default_path = userData.default_path;

  userData.stableRedirect = requireAuth(
    userData.permissionsSet,
    `/${default_path}`,
  );

  return userData;
};
