import {insurancePolicyArchivePermissions as permissions} from 'components/new/pages/nsi/autobase/pages/insurance_policy_archive/_config-data/permissions';

import component from 'components/new/pages/nsi/autobase/pages/insurance_policy_archive/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/registry-config';

export const item = 'insurance_policy_archive';
export const id = getToConfig(null).list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Архив страховок',
  isNewRegistry: false,
  entyity: 'insurance_policy_archive',

  component,
  permissions,
};
