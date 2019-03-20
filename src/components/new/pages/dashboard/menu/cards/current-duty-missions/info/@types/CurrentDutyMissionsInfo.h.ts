import {
  CurrentDutyMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

export type DispatchPropsCurrentMissionInfo = {
  handleClose: any;
  loadData: any;
  actionGetDutyMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetDutyMissionById>;
  actionUpdateDutyMission: HandleThunkActionCreator<typeof missionsActions.actionUpdateDutyMission>;
};

export type PropsCurrentMissionInfo = {
  infoData: CurrentDutyMissionsInfoDataType;
} & DispatchPropsCurrentMissionInfo;

export type StateCurrentMissionInfo = {
  showRouteInfoForm: boolean,
  showMissionRejectForm: boolean,
};
