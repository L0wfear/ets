/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "inquiry_expiring_date" *//* 'components/reports/operational/inquiry_expiring_date/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/inquiry_expiring_date/report';

export default [
  {
    component,
  },
];
