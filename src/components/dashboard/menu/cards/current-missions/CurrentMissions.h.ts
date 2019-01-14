import {
  CurrentMissionsItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export interface StatePropsCurrentMissions {
  items: CurrentMissionsItemsType[];
}

export interface DispatchPropsCurrentMissions {
  loadMissionDataById: (id: number) => any;
}

export interface OwnPropsCurrentMissions {
}

export type PropsCurrentMissions = (
  StatePropsCurrentMissions
  & DispatchPropsCurrentMissions
  & OwnPropsCurrentMissions
);

export interface StateCurrentMissions {
}
