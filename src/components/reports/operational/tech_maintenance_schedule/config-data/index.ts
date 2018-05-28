import permissions from 'components/reports/operational/tech_maintenance_schedule/config-data/permissions';
import components from 'components/reports/operational/tech_maintenance_schedule/config-data/components';

export default {
  path: '/tech-maintenance-schedule',
  title: 'График проведения технического обслуживания транспортных средств',
  entyity: 'autobase_tech_maintenance_schedule_report',
  noDotList: false,
  components,
  permissions,
};
