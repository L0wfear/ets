import permissions from 'components/directories/autobase/tech_maintenance_order_registry/config-data/permissions';
import components from 'components/directories/autobase/tech_maintenance_order_registry/config-data/components';

export default {
  path: '/tech-maintenance-order-registry',
  title: 'Реестр регламентов ТО',
  entyity: 'autobase_tech_maintenance_order',
  noDotList: false,
  components,
  permissions,
};
