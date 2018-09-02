import {
  FutureMissionsItemsType,
  FutureMissionsFormDataType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/future-mission.h';

export type PropsFutureMissions = {
  items: FutureMissionsItemsType[];
};

export type StateFutureMissions = {
  showMissionFormWrap: boolean;
  elementMissionFormWrap: FutureMissionsFormDataType;
};