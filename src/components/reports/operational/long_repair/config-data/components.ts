import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "long_repair" */ 'components/reports/operational/long_repair/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];