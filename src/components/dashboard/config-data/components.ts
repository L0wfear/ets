/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "dashboard" *//* 'components/dashboard/DashboardPage'), {
  LoadingComponent,
})

*/

import component from 'components/dashboard/DashboardPage';

export default [
  {
    component,
  },
];
