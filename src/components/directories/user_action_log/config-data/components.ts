import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "user_action_log" */ 'components/directories/user_action_log/UserActionLogList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
