import permissions from 'components/directories/employee_on_car/config-data/permissions';
import component from 'components/directories/employee_on_car/config-data/components';

export default {
  path: '/employee_on_car',
  title: 'Матрица распределения ТС и водителей',
  entyity: 'employee_on_car',
  noDotList: false,
  component,
  permissions,
};
