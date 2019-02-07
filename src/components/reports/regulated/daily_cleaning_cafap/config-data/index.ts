import permissions from 'components/reports/regulated/daily_cleaning_cafap/config-data/permissions';
import component from 'components/reports/regulated/daily_cleaning_cafap/config-data/components';

export default {
  path: '/daily-cleaning-reports-cafap',
  title: 'Статус по уборке (ЦАФАП)',
  entyity: 'cleaning_status_cafap_report',
  noDotList: false,
  hiddenNav: true,
  component,
  permissions,
};
