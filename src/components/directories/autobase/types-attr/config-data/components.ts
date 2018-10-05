/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "types_attr" *//* 'components/directories/autobase/types-attr/TypesAttrList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/autobase/types-attr/TypesAttrList';

export default [
  {
    component,
  },
];
