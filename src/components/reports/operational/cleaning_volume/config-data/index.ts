import permissions from 'components/reports/operational/cleaning_volume/config-data/permissions';
import components from 'components/reports/operational/cleaning_volume/config-data/components';

export default {
  path: '/cleaning_volume',
  title: 'Удельный объем уборки для ТС',
  entyity: 'cleaning_volume',
  noDotList: false,
  components,
  permissions,
};
