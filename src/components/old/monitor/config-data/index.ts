import permissions from 'components/old/monitor/config-data/permissions';
import component from 'components/old/monitor/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const monitor_page_data: ConfigPageData = {
  path: '/monitor',
  routePath: '/monitor/:gov_number?/:waybill_id?',
  title: 'Карта',
  entyity: 'monitor',

  component,
  permissions,

  isNewRegistry: false,
};

export default monitor_page_data;
