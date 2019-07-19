import permissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import component from 'components/new/pages/nsi/employee/_config-data/components';

import { config, registryKey } from 'components/new/pages/nsi/employee/_config-data/registry-config';
import * as queryString from 'query-string';

const filterKey = `${registryKey}_filters`;

export default {
  path: '/nsi/employees',
  pathFormMenu: `/nsi/employees?${
    queryString.stringify({
      [filterKey]: encodeURIComponent(JSON.stringify({ active__in: [true] })),
    })}`,
  routePath: `/nsi/employees/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр сотрудников',
  isNewRegistry: true,
  entyity: 'employee',
  noDotList: false,
  component,
  permissions,
};
