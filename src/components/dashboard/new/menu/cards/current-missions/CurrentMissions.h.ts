import {
  CurrentMissionsItemsType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/current-mission.h';

export type PropsCurrentMissions = {
  items: CurrentMissionsItemsType[];
  loadMissionDataById: (id?: number) => any;
}