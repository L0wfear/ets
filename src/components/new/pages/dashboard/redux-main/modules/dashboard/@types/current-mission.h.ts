import { MissionDataType } from 'redux-main/reducers/modules/missions/mission/@types';

export type CurrentMissionsItemsSubItemsSubItemsType = {
  id: number;
  tooltip?: string;
  title: string;
};

export type CurrentMissionsItemsSubItemsType = {
  subItems: CurrentMissionsItemsSubItemsSubItemsType[],
  tooltip?: string;
  title: string;
};

export type CurrentMissionsItemsType = {
  subItems: CurrentMissionsItemsSubItemsType[],
  tooltip?: string;
  title: string;
};

export type CurrentMissionsAnsType = {
  items: CurrentMissionsItemsType[];
  items_centralized: CurrentMissionsItemsType[];
  items_decentralized: CurrentMissionsItemsType[];
  tooltip?: string;
  title: string;
  title_centralized: string;
  title_decentralized: string;
};

export type CurrentMissionsInfoDataType = MissionDataType;
