import permissions from 'components/new/pages/nsi/user_action_log/_config-data/permissions';
import component from 'components/new/pages/nsi/user_action_log/_config-data/components';

export const item = 'user_action_log';
export const path = `/nsi/${item}`;
export const routePath = `/nsi/${item}`;

export default {
  item,
  path,
  routePath,
  title: 'Журнал действий пользователей',
  isNewRegistry: false,
  entyity: 'user_action_log',

  component,
  permissions,
};
