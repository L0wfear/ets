import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "dt_coverage_report" */ 'components/coverage_reports/dt_coverage/DtCoverageReport'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
