import permissions from 'components/directories/autobase/tech_inspection/config-data/permissions';
import component from 'components/directories/autobase/tech_inspection/config-data/components';

export default {
  path: '/tech-inspection',
  title: 'Реестр техосмотров',
  entyity: 'autobase_tech_inspection',
  noDotList: false,
  component,
  permissions,
};
