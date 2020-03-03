import permissions from 'components/old/reports/regulated/daily_cleaning_cafap/config-data/permissions';
import component from 'components/old/reports/regulated/daily_cleaning_cafap/config-data/components';

export default {
  path: '/daily-cleaning-reports-cafap',
  title: 'Статус по уборке (ЦАФАП)',
  entyity: 'cleaning_status_cafap_report',

  hiddenNav: true,
  component,
  permissions,
};
