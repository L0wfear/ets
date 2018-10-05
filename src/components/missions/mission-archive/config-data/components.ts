/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "mission-archive-journal" *//* 'components/missions/mission-archive/config-data/MissionsArchiveJournalWrap'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/missions/mission-archive/config-data/MissionsArchiveJournalWrap';

export default [
  {
    component,
  },
];
