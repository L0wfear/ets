import {
  CurrentMissionsInfoDataType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/current-mission.h';
import { MissionType } from 'redux/trash-actions/mission/@types/promise-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentMissionsInfoDataType;
  getMissionById: (id: number) => Promise<MissionType>;
  updateMission: (payload: MissionType) => any;

  handleClose: Function;
  loadData: Function;
};

export type StateCurrentMissionInfo = {
  showMissionInfoForm: boolean,
  showMissionRejectForm: boolean,
};
