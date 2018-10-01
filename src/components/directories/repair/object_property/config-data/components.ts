import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "object_property" */ 'components/directories/repair/object_property/ObjectPropertyList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
