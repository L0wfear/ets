import permissions from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/registry-config';

export const item = 'insurance_policy';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр страховок',
  isNewRegistry: true,
  entyity: 'autobase_insurance_policy',
  noDotList: false,
  component,
  permissions,
};
