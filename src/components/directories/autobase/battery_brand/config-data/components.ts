/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "battery_brand" *//* 'components/directories/autobase/battery_brand/BatteryBrandList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/autobase/battery_brand/BatteryBrandList';

export default [
  {
    component,
  },
];