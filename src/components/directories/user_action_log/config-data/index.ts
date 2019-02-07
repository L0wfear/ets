import permissions from 'components/directories/user_action_log/config-data/permissions';
import component from 'components/directories/user_action_log/config-data/components';

export default {
  path: '/user-action-log',
  title: 'Журнал действий пользователя',
  entyity: 'user_action_log',
  noDotList: false,
  component,
  permissions,
};
