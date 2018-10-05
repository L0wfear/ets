/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "tech_inspection" *//* 'components/directories/autobase/tech_inspection/TechInspectionList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/autobase/tech_inspection/TechInspectionList';

export default [
  {
    component,
  },
];
