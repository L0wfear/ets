import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "employee_on_car" */ 'components/directories/employee_on_car/EmployeeOnCarList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
