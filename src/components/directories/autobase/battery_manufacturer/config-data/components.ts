import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "battery_manufacturer" */ 'components/directories/autobase/battery_manufacturer/BatteryManufacturerList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
