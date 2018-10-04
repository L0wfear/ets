import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "medical_stats" */ 'components/directories/medical_stats/MedicalStatsList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
