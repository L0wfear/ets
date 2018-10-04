import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "car_usage_report_with_track" */ 'components/reports/operational/car_usage_report_with_track/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];