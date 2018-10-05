import {
  CurrentDutyMissionsInfoDataType,
} from 'components/dashboard/redux/modules/dashboard/@types/current-duty-mission.h';
import { DutyMissionType } from 'redux/trash-actions/mission/@types/promise-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentDutyMissionsInfoDataType;
  getDutyMissionById: (id) => Promise<DutyMissionType>;
  updateDutyMission: (dutyMission: DutyMissionType) => any;
  handleClose: Function;
  loadData: Function;
};

export type StateCurrentMissionInfo = {
  showRouteInfoForm: boolean,
  showMissionRejectForm: boolean,
};
