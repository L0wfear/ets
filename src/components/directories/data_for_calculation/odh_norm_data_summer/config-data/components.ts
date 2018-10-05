/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "odh_norm_data_summer" *//* 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerList';

export default [
  {
    component,
  },
];
