/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "mission_progress" *//* 'components/reports/operational/mission_progress/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/mission_progress/report';

export default [
  {
    component,
  },
];
