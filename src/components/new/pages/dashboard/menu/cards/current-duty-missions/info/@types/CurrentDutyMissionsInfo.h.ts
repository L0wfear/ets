import {
  CurrentDutyMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { DutyMissionType } from 'redux-main/trash-actions/mission/@types/promise-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentDutyMissionsInfoDataType;
  getDutyMissionById: (id) => Promise<any>;
  updateDutyMission: (dutyMission: DutyMissionType) => any;
  handleClose: any;
  loadData: any;
};

export type StateCurrentMissionInfo = {
  showRouteInfoForm: boolean,
  showMissionRejectForm: boolean,
};
