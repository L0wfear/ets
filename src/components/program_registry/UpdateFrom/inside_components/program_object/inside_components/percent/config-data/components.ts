/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "program_object_percent" *//* 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components/percent/PercentModalList';

export default [
  {
    component,
  },
];
