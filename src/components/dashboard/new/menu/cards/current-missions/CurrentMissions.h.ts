import {
  CurrentMissionsItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/current-mission.h';

export type PropsCurrentMissions = {
  items: CurrentMissionsItemsType[];
  loadMissionDataById: (id?: number) => any;
}