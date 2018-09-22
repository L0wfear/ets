import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "odh_coverage_report" */ 'components/coverage_reports/odh_coverage/OdhCoverageReport'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
