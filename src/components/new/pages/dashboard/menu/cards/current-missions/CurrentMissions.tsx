import * as React from 'react';

import { compose } from 'recompose';
import withDefaultCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import ListByTypeCurerntMission from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/ListByTypeCurerntMission';
import CurrentMissionInfo from 'components/new/pages/dashboard/menu/cards/current-missions/info/CurrentMissionInfo';

import { CurrentMissionsLineDates } from 'components/new/pages/dashboard/menu/cards/current-missions/styled/styled';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

import { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type OwnPropsCurrentMissions = {};
export type PropsCurrentMissions = OwnPropsCurrentMissions;

const CurrentMissions: React.FC<PropsCurrentMissions> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    const handleClick = React.useCallback(
      (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => {
        dispatch(
          dashboardLoadMissionDataForCurrentMission(lastSubItem.id),
        );
      },
      [dispatch],
    );

    return React.useMemo(
      () => (
        <CurrentMissionsLineDates>
          <ListByTypeCurerntMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={handleClick} />
          <ListByTypeCurerntMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={handleClick} />
        </CurrentMissionsLineDates>
      ),
      [handleClick],
    );
  },
);

export default compose<PropsCurrentMissions, PropsToDefaultCard>(
  withDefaultCard({
    path: 'current_missions',
    loadData: dashboardLoadCurrentMissions,
    InfoComponent: CurrentMissionInfo,
  }),
)(CurrentMissions);
