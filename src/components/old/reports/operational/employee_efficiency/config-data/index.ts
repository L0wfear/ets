import permissions from 'components/old/reports/operational/employee_efficiency/config-data/permissions';
import component from 'components/old/reports/operational/employee_efficiency/config-data/components';

export default {
  path: '/employee-efficiency-report',
  title: 'Работа сотрудников по ручной уборке',
  entyity: 'employee_efficiency_report',

  component,
  permissions,
};
