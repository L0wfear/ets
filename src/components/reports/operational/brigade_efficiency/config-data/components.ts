/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "brigade_efficiency" *//* 'components/reports/operational/brigade_efficiency/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/brigade_efficiency/report';

export default [
  {
    component,
  },
];
