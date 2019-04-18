import permissions from 'components/new/pages/nsi/technical_operation_relations/_config-data/permissions';
import component from 'components/new/pages/nsi/technical_operation_relations/_config-data/components';
import * as registryData from 'components/new/pages/nsi/technical_operation_relations/_config-data/registry-config';
import carActualRegistryData from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';

export const item = 'technical_operation_relations';
export const id = registryData.getToConfig().list.data.uniqKeyForParams;
export const path = `/nsi/${item}`;
export const routePath = [
  `/nsi/${item}/:technical_operation_relations_type_form?${carActualRegistryData.formPath}`,
];

export default {
  item,
  id,
  path,
  routePath,
  title: 'Сводная форма связей',
  isNewRegistry: true,
  entyity: 'technical_operation_relations',
  noDotList: false,
  component,
  permissions,
};
