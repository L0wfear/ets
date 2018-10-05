/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "daily_cleaning_cafap" *//* 'components/reports/regulated/daily_cleaning_cafap/report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/regulated/daily_cleaning_cafap/report';

export default [
  {
    component,
  },
];
