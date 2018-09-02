import {
  CurrentMissionsInfoDataType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/current-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentMissionsInfoDataType;

  handleClose: Function;
  loadData: Function;
};

export type StateCurrentMissionInfo = {
  showMissionInfoForm: boolean,
  showMissionRejectForm: boolean,
};
