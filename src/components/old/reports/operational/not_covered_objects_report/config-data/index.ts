import permissions from 'components/old/reports/operational/not_covered_objects_report/config-data/permissions';
import component from 'components/old/reports/operational/not_covered_objects_report/config-data/components';

export default {
  path: '/not_covered_objects_report',
  title: 'ОДХ/ДТ и элементы, не назначенные на централизованные задания',
  entyity: 'not-covered-objects-report',

  component,
  permissions,
};
