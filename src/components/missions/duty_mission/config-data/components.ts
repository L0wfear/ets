/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "duty-missions-journal" *//* 'components/missions/duty_mission/config-data/DutyMissionsJournalWrap'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/missions/duty_mission/config-data/DutyMissionsJournalWrap';

export default [
  {
    component,
  },
];
