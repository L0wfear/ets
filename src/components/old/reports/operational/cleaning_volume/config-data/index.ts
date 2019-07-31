import permissions from 'components/reports/operational/cleaning_volume/config-data/permissions';
import component from 'components/reports/operational/cleaning_volume/config-data/components';

export default {
  path: '/cleaning_volume',
  title: 'Удельный объем уборки для ТС',
  entyity: 'cleaning_volume',
  noDotList: false,
  component,
  permissions,
};
