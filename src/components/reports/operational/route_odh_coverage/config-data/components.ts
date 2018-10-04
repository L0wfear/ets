import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "route_odh_coverage" */ 'components/reports/operational/route_odh_coverage/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];