import permissions from 'components/directories/autobase/spare_part/config-data/permissions';
import component from 'components/directories/autobase/spare_part/config-data/components';

export default {
  path: '/spare-part',
  title: 'Реестр запчастей',
  entyity: 'autobase_spare_part',
  noDotList: false,
  component,
  permissions,
};
