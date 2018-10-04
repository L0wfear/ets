import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "daily_cleaning_ets" */ 'components/reports/regulated/daily_cleaning_ets/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];