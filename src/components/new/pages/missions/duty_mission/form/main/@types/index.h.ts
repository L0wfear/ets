import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsDutyMission = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
  employeeIndex: IStateEmployee['employeeIndex'];
  STRUCTURE_FIELD_VIEW: ReturnType<
    typeof getSessionStructuresParams
  >['STRUCTURE_FIELD_VIEW'];
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  edcRequest: IStateMissions['dutyMissionData']['edcRequest'];
  dependeceOrder: IStateMissions['dutyMissionData']['dependeceOrder'];
  dependeceTechnicalOperation: IStateMissions['dutyMissionData']['dependeceTechnicalOperation'];
};

export type DispatchPropsDutyMission = {
  dispatch: EtsDispatch,
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
  actionPrintFormDutyMission: HandleThunkActionCreator<typeof missionsActions.actionPrintFormDutyMission>;
  actionLoadOrderAndTechnicalOperationByIdForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionLoadOrderAndTechnicalOperationByIdForDutyMission>;
  actionSetDependenceOrderDataForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceOrderDataForDutyMission>;
  loadEdcRequiedByIdForDutyMission: HandleThunkActionCreator<typeof missionsActions.loadEdcRequiedByIdForDutyMission>;
  actionReseSetDependenceMissionDataForDutyMissionForm: HandleThunkActionCreator<typeof missionsActions.actionReseSetDependenceMissionDataForDutyMissionForm>;
};
export type OwnDutyMissionProps = WithFormRegistrySearchAddProps<Partial<DutyMission>> & {
  readOnly?: boolean;
};

export type PropsDutyMissionWithForm = StatePropsDutyMission &
  DispatchPropsDutyMission &
  OwnDutyMissionProps;

export type PropsDutyMissionForm = OutputWithFormProps<
  PropsDutyMissionWithForm,
  DutyMission,
  any,
  any
>;
export type StateDutyMission = {};
