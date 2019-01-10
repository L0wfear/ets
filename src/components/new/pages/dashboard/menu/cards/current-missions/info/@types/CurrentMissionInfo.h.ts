import {
  CurrentMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';
import { MissionType } from 'redux-main/trash-actions/mission/@types/promise-mission.h';

export type PropsCurrentMissionInfo = {
  infoData: CurrentMissionsInfoDataType;
  getMissionById: (id: number) => Promise<MissionType>;
  updateMission: (payload: MissionType) => any;
  loadDataAfterCloseMission: () => Promise<any>;

  handleClose: any;
  loadData: any;
};

export type StateCurrentMissionInfo = {
  showMissionInfoForm: boolean;
  showMissionRejectForm: boolean;
  action_at: string | Date;
};
