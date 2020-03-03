import * as React from 'react';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import ListByTypeCurerntMission from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/ListByTypeCurerntMission';
import CurrentMissionInfo from 'components/new/pages/dashboard/menu/cards/current-missions/info/CurrentMissionInfo';

import {
  dashboardLoadCurrentMissions,
  dashboardLoadMissionDataForCurrentMission,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

type OwnProps = PropsToDefaultCard;
type Props = OwnProps & WithRequirePermissionAddProps;

const CurrentMissions: React.FC<Props> = React.memo(
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

    return (
      <div>
        <ListByTypeCurerntMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={handleClick} />
        <ListByTypeCurerntMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={handleClick} />
      </div>
    );
  },
);

export default withDefaultCard<OwnProps>({
  path: 'current_missions',
  loadData: dashboardLoadCurrentMissions,
  InfoComponent: CurrentMissionInfo,
})(CurrentMissions);
