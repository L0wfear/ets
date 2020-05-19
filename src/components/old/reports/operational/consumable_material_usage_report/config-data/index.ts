import permissions from 'components/old/reports/operational/consumable_material_usage_report/config-data/permissions';
import component from 'components/old/reports/operational/consumable_material_usage_report/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const consumable_material_usage_report_page_config: ConfigPageData = {
  path: '/consumable-material-usage-report',
  title: 'Отчет по использованию расходных материалов',
  entyity: 'consumable_material_usage_report',

  component,
  permissions,

  isNewRegistry: false,
};

export default consumable_material_usage_report_page_config;
