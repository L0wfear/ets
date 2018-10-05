/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "mission-templates-journal" *//* 'components/missions/mission_template/config-data/MissionTemplatesJournalWrap'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/missions/mission_template/config-data/MissionTemplatesJournalWrap';

export default [
  {
    component,
  },
];
