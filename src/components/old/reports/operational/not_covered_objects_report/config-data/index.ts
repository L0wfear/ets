import permissions from 'components/old/reports/operational/not_covered_objects_report/config-data/permissions';
import component from 'components/old/reports/operational/not_covered_objects_report/config-data/components';

export default {
  path: '/not-covered-objects-report',
  title: 'ОДХ/ДТ и элементы, не назначенные на централизованные задания',
  entyity: 'not_covered_objects_report',

  component,
  permissions,
};
