import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "cleaning_rate" */ 'components/directories/data_for_calculation/cleaning_rate/CleaningRateDirectory'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
