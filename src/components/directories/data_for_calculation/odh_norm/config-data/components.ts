/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "odh_norm" *//* 'components/directories/data_for_calculation/odh_norm/ODHNormList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/data_for_calculation/odh_norm/ODHNormList';

export default [
  {
    component,
  },
];
