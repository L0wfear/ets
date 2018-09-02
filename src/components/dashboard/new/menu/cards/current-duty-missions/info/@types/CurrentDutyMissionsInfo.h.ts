import {
  CurrentDutyMissionsInfoDataType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/current-duty-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentDutyMissionsInfoDataType;

  handleClose: Function;
  loadData: Function;
};

export type StateCurrentMissionInfo = {
  showRouteInfoForm: boolean,
  showMissionRejectForm: boolean,
};
