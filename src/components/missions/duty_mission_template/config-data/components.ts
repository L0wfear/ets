/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "duty-mission-templates-journal" *//* 'components/missions/duty_mission_template/config-data/DutyMissionTemplatesJournalWrap'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/missions/duty_mission_template/config-data/DutyMissionTemplatesJournalWrap';

export default [
  {
    component,
  },
];
