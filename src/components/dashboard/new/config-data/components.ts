import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "dashboard" */ 'components/dashboard/new/DashboardPage'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
