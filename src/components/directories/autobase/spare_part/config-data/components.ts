import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "spare_part" */ 'components/directories/autobase/spare_part/SparePartList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
