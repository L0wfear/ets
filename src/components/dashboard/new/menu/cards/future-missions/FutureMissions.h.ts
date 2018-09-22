import {
  FutureMissionsItemsType,
  FutureMissionsFormDataType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/future-mission.h';
import { MissionType } from 'redux-main/trash-actions/mission/@types/promise-mission.h';

export type PropsFutureMissions = {
  items: FutureMissionsItemsType[];
  getMissionById: (id: number) => Promise<MissionType>;
};

export type StateFutureMissions = {
  showMissionFormWrap: boolean;
  elementMissionFormWrap: FutureMissionsFormDataType;
};