import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "employee_efficiency" */ 'components/reports/operational/employee_efficiency/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];