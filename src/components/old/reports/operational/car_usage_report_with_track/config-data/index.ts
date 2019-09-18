import permissions from 'components/old/reports/operational/car_usage_report_with_track/config-data/permissions';
import component from 'components/old/reports/operational/car_usage_report_with_track/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const car_usage_repor_page_config: ConfigPageData = {
  path: '/car-usage-report',
  title: 'Статистика выхода техники',
  entyity: 'car_usage_report_with_track_report',

  component,
  permissions,

  isNewRegistry: false,
};

export default car_usage_repor_page_config;
