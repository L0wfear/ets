import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "battery_branch" */ 'components/directories/autobase/battery_brand/BatteryBrandList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
