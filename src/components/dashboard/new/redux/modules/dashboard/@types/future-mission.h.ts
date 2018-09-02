import {
  MissionDataType,
} from 'redux/trash-actions/mission/@types/promise-mission.h';

export type FutureMissionsItemsType = {
  mission_id: number,
  tooltip?: string;
  title: string;
}

export type FutureMissionsAnsType = {
  items: FutureMissionsItemsType[];
  title: string;
};

export type FutureMissionsInfoDataType = void;

export type FutureMissionsFormDataType = MissionDataType;
