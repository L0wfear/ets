import permissions from 'components/new/pages/nsi/repair/pages/object_property/_config-data/permissions';
import component from 'components/new/pages/nsi/repair/pages/object_property/_config-data/components';

export const item = 'object_property';
export const patrialEndPath = `/${item}/:selected_odh_dt_value?`;
export const path = `/nsi/repair/${item}/odh`;
export const routePath = `/nsi/repair/${item}/:selected_odh_dt_value?`;

export default {
  item,
  id: null,
  patrialEndPath,
  path,
  routePath,
  title: 'Справочник характеристик объектов',
  isNewRegistry: true,
  entyity: 'ets_object_properties',
  noDotList: false,
  component,
  permissions,
};
