import permissions from 'components/new/pages/program_registry/_config-data/permissions';
import component from 'components/new/pages/program_registry/_config-data/components';

import { getToConfig } from 'components/new/pages/program_registry/_config-data/registry-config';

export const item = 'program_registry';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/${item}`;
export const routePath = `/${item}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Планирование ремонтных работ',
  isNewRegistry: true,
  entyity: 'repair_program',

  component,
  permissions,
};
