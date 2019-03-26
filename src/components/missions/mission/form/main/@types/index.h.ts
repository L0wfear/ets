import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { HandleThunkActionCreator } from 'react-redux';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type PropsMissionFormLazy = {
  showForm: boolean;
  element: Partial<Mission> | null;
  onFormHide: OnFormHideType;

  notChangeCar?: boolean;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsMission = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  edcRequest: IStateMissions['missionData']['edcRequest'];
  waybillData: IStateMissions['missionData']['waybillData'];
  dependeceOrder: IStateMissions['missionData']['dependeceOrder'];
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
} & ReturnType<typeof getSessionStructuresParams>;

export type DispatchPropsMission = {
  actionPrintFormMission: HandleThunkActionCreator<typeof missionsActions.actionPrintFormMission>;
  actionLoadOrderAndTechnicalOperationByIdForMission: HandleThunkActionCreator<typeof missionsActions.actionLoadOrderAndTechnicalOperationByIdForMission>;
  actionLoadWaybillDataByIdForMission: HandleThunkActionCreator<typeof missionsActions.actionLoadWaybillDataByIdForMission>;
  loadEdcRequiedByIdForMission: HandleThunkActionCreator<typeof missionsActions.loadEdcRequiedByIdForMission>;
};
export type OwnMissionProps = {
  element: Partial<Mission> | null;
  handleHide: OnFormHideType;

  notChangeCar?: boolean;

  page: string;
  path?: string;
};

export type PropsMissionWithForm = StatePropsMission &
  DispatchPropsMission &
  OwnMissionProps & {
    getMapImageInBase64ByKey: any;
  };

export type PropsMissionForm = OutputWithFormProps<
  PropsMissionWithForm,
  Mission,
  any,
  any
>;
export type StateMission = {};
