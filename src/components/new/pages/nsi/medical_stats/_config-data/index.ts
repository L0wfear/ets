import permissions from 'components/new/pages/nsi/medical_stats/_config-data/permissions';
import component from 'components/new/pages/nsi/medical_stats/_config-data/components';

export const item = 'medical_stats';
export const path = `/nsi/${item}`;
export const routePath = `/nsi/${item}`;

export default {
  item,
  path,
  routePath,
  title: 'Статистика прохождения мед. осмотров',
  isNewRegistry: true,
  entyity: 'medical_stats',
  noDotList: false,
  component,
  permissions,
};
