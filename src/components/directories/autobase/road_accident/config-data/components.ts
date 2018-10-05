/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "hidden_road_accident" *//* 'components/directories/autobase/road_accident/RoadAccidentList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/autobase/road_accident/RoadAccidentList';

export default [
  {
    component,
  },
];
