import {
  CurrentMissionsInfoDataType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type CurrentMissionInfoDispatchProps = {
  dispatch: EtsDispatch,
  actionGetMissionById: HandleThunkActionCreator<typeof missionsActions.actionGetMissionById>;
  actionUpdateMission: HandleThunkActionCreator<typeof missionsActions.actionUpdateMission>;
} & Record<any, any>;

export type PropsCurrentMissionInfo = {
  infoData: CurrentMissionsInfoDataType;
  loadDataAfterCloseMission: () => Promise<any>;

  handleClose: any;
  loadData: any;
} & CurrentMissionInfoDispatchProps;

export type StateCurrentMissionInfo = {
  showMissionInfoForm: boolean;
  missionRejectForm: Mission;
  action_at: string | Date;
};
