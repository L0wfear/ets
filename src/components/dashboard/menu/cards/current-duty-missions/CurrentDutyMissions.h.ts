import {
  CurrentDutyMissionsItemsSubItemDatasType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

import {
  OwnerPropsDefaultCard,
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

export type InnerPropsCurrentDutyMissions<P> = OwnerPropsDefaultCard<P> & {
};

export interface StatePropsCurrentDutyMissions {}
export interface DispatchPropsCurrentDutyMissions {
  routesLoadRouteById: (
    duty_mission_data: CurrentDutyMissionsItemsSubItemDatasType,
    duty_mission_route_id: number,
  ) => any;
}

export interface OwnPropsCurrentDutyMissions {}

export type PropsCurrentDutyMissions = (
  StatePropsCurrentDutyMissions
  & DispatchPropsCurrentDutyMissions
  & OwnPropsCurrentDutyMissions
);

export type StateCurrentDutyMissions = {
};
