/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "track_events" *//* 'components/reports/operational/track_events/reportProps'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/reports/operational/track_events/reportProps';

export default [
  {
    component,
  },
];
