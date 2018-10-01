import {
  CurrentMissionsItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export type PropsCurrentMissions = {
  items: CurrentMissionsItemsType[];
  loadMissionDataById: (id?: number) => any;
}