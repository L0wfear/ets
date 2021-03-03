import permissions from 'components/new/pages/nsi/user_acces/_config-data/permissions';
import component from 'components/new/pages/nsi/user_acces/_config-data/components';
import { config } from 'components/new/pages/nsi/user_acces/_config-data/registry-config';
import * as queryString from 'query-string';
import { registryKey } from 'components/new/pages/nsi/user_acces/_config-data/registry-config';

const path = '/nsi/users_access';
const filterKey = `${registryKey}_filters`;

export default {
  path,
  routePath: `/nsi/users_access/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр настройки доступов',
  isNewRegistry: false,
  entyity: 'users_access',
  pathFormMenu: `${path}?${
    queryString.stringify({
      [filterKey]: encodeURIComponent(JSON.stringify({ status__in: ['Активен'] })),
    })}`,

  component,
  permissions,
};
