import { MissionDataType } from 'redux-main/reducers/modules/missions/mission/@types';

export type CurrentMissionsItemsSubItemsSubItemsType = {
  id: number;
  tooltip?: string;
  title: string;
};

export type CurrentMissionsItemsSubItemsType = {
  subItems: Array<CurrentMissionsItemsSubItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type CurrentMissionsItemsType = {
  subItems: Array<CurrentMissionsItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type CurrentMissionsAnsType = {
  items: Array<CurrentMissionsItemsType>;
  items_centralized: Array<CurrentMissionsItemsType>;
  items_decentralized: Array<CurrentMissionsItemsType>;
  tooltip?: string;
  title: string;
  title_centralized: string;
  title_decentralized: string;
};

export type CurrentMissionsInfoDataType = MissionDataType;
