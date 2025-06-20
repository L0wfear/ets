import * as React from 'react';

import withDefaultCard, { PropsToDefaultCard } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import ListByTypeCurerntDutyMission from 'components/new/pages/dashboard/menu/cards/current-duty-missions/collapse-list/ListByTypeCurerntDutyMission';

import {
  dashboardLoadCurrentDutyMissions,
  dashboardLoadRouteDataForCurrentDutyMissions,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import CurrentDutyMissionInfo from 'components/new/pages/dashboard/menu/cards/current-duty-missions/info/CurrentDutyMissionsInfo';

import {
  CurrentDutyMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

type OwpProps = PropsToDefaultCard;
type Props = OwpProps & WithRequirePermissionAddProps;

const CurrentDutyMissions: React.FC<Props> = React.memo(
  () => {
    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      (lastSubItem: CurrentDutyMissionsItemsSubItemsSubItemsType) => {
        dispatch(
          dashboardLoadRouteDataForCurrentDutyMissions(
            lastSubItem.data,
            lastSubItem.data.duty_mission_route_id,
          ),
        );
      },
      [dispatch],
    );

    return (
      <div>
        <ListByTypeCurerntDutyMission titleKey="title_centralized" itemsKey="items_centralized" handleClick={handleClick} />
        <ListByTypeCurerntDutyMission titleKey="title_decentralized" itemsKey="items_decentralized" handleClick={handleClick} />
      </div>
    );
  },
);

export default withDefaultCard<OwpProps>({
  path: 'current_duty_missions',
  loadData: dashboardLoadCurrentDutyMissions,
  InfoComponent: CurrentDutyMissionInfo,
})(CurrentDutyMissions);
