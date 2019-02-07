import permissions from 'components/directories/autobase/repair_company/config-data/permissions';
import component from 'components/directories/autobase/repair_company/config-data/components';

export default {
  path: '/repair-company',
  title: 'Реестр ремонтных организаций',
  entyity: 'autobase_company',
  noDotList: false,
  component,
  permissions,
};
