import {
  CurrentMissionsItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';
import {
  OwnerPropsDefaultCard,
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

export interface InnerPropsCurrentMissions extends OwnerPropsDefaultCard {
}

export interface StatePropsCurrentMissions {
}

export interface DispatchPropsCurrentMissions {
  loadMissionDataById: (id: number) => any;
}

export interface OwnPropsCurrentMissions {
  items: CurrentMissionsItemsType[];
}

export type PropsCurrentMissions = (
  StatePropsCurrentMissions
  & DispatchPropsCurrentMissions
  & OwnPropsCurrentMissions
);

export interface StateCurrentMissions {
}
