import permissions from 'components/reports/regulated/daily_cleaning_ets/config-data/permissions';
import component from 'components/reports/regulated/daily_cleaning_ets/config-data/components';

export default {
  path: '/daily-cleaning-reports-ets',
  title: 'Статус по уборке',
  entyity: 'cleaning_status_report',
  noDotList: false,
  hiddenNav: true,
  component,
  permissions,
};
