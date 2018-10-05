import {
  MissionDataType,
} from 'redux/trash-actions/mission/@types/promise-mission.h';

export type CurrentMissionsItemsSubItemsType = {
  id: number;
  tooltip?: string;
  title: string;
};

export type CurrentMissionsItemsType = {
  subItems: CurrentMissionsItemsSubItemsType[],
  tooltip?: string;
  title: string;
}

export type CurrentMissionsAnsType = {
  items: CurrentMissionsItemsType[];
  tooltip?: string;
  title: string;
};

export type CurrentMissionsInfoDataType = MissionDataType;
