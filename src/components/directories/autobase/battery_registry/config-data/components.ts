/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "battery_registry" *//* 'components/directories/autobase/battery_registry/BatteryRegList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];

*/

import component from 'components/directories/autobase/battery_registry/BatteryRegList';

export default [
  {
    component,
  },
];