/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "technical_operation_relations" *//* 'components/directories/technical_operation_relations/TechnicalOperationRelationsListWrap'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/technical_operation_relations/TechnicalOperationRelationsListWrap';

export default [
  {
    component,
  },
];
