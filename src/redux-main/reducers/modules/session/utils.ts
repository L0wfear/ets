
import requireAuth from 'utils/auth';
import { createFio } from 'utils/labelFunctions';

const OPERATIONS = {
  L: 'list',
  C: 'create',
  R: 'read',
  U: 'update',
  D: 'delete',
  REW: 'review',
};

export function getFullAccess(entity, permission = ['L', 'C', 'R', 'U', 'D']) {
  return permission.map((op) => `${entity}.${OPERATIONS[op]}`);
}

export const withSpecificPermissions = (user) => {
  const permissions = [];

  if (user.login === 'gormost') {
    permissions.push(...getFullAccess('bridges'));
    permissions.push(...getFullAccess('pedestrian_tunnels'));
    permissions.push(...getFullAccess('pedestrian_tunnel_exits'));
    permissions.push(...getFullAccess('fountains'));
  }
  /* docs */
  if(!user.permissions.includes('docs_dorinvest.list')){
    permissions.push(...getFullAccess('docs_close_waybill')); // Закрытие путевого листа
    permissions.push(...getFullAccess('docs_create_mission')); // Создание децентрализованного задания
    permissions.push(...getFullAccess('docs_close_mission')); // Закрытие централизованного_децентрализованного задания
    permissions.push(...getFullAccess('docs_issue_a_waybill')); // Выдача путевого листа с заданием
    permissions.push(...getFullAccess('docs_create_mission_by_order')); // Создание централизованного задания
    permissions.push(...getFullAccess('docs_issue_a_waybill_without_mission'));
  }
  permissions.push(...getFullAccess('userNotification'));

  /* end docs */

  // console.info(permissions.push(...getFullAccess('your_permission')));

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
    ...withSpecificPermissions(userDataRaw),
  ];

  // userData.permissions = userData.permissions.filter((p) => p !== 'inspect.autobase_closed.update')
  userData.permissionsSet = new Set(userData.permissions);

  userData.isKgh = userData.permissionsSet.has(
    'common.nsi_okrug_company_columns_show',
  );
  userData.isOkrug = userData.okrug_id;
  userData.isGlavControl = userData.permissionsSet.has('role.change');

  const default_path = userData.default_path;

  userData.stableRedirect = requireAuth(
    userData.permissionsSet,
    `/${default_path}`,
  );

  return userData;
};
