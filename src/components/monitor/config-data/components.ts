import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "monitor" */ 'components/monitor/MonitorPage'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
