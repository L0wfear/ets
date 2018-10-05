/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "routes_list" *//* 'components/route/RoutesList'), {
  LoadingComponent,
});

export default [
  {
    component,
  },
];
*/

import component from 'components/route/RoutesList';

export default [
  {
    component,
  },
];
