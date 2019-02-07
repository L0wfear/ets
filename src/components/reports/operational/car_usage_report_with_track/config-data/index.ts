import permissions from 'components/reports/operational/car_usage_report_with_track/config-data/permissions';
import component from 'components/reports/operational/car_usage_report_with_track/config-data/components';

export default {
  path: '/car-usage-report',
  title: 'Статистика выхода техники',
  entyity: 'car_usage_report_with_track_report',
  noDotList: false,
  component,
  permissions,
};
