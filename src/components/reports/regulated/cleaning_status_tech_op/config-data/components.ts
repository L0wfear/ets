import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "cleaning_status_tech_op" */ 'components/reports/regulated/cleaning_status_tech_op/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];