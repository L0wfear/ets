import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type PropsDutyMissionFormLazy = {
  showForm: boolean;
  element: Partial<DutyMission> | null;
  onFormHide: OnFormHideType;
  readOnly?: boolean;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsDutyMission = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
  employeeIndex: IStateEmployee['employeeIndex'];
  STRUCTURE_FIELD_VIEW: ReturnType<typeof getSessionStructuresParams>['STRUCTURE_FIELD_VIEW'];
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  dependeceOrder: IStateMissions['dutyMissionData']['dependeceOrder'];
  dependeceTechnicalOperation: IStateMissions['dutyMissionData']['dependeceTechnicalOperation'];
};

export type DispatchPropsDutyMission = {
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
  actionPrintFormDutyMission: HandleThunkActionCreator<typeof missionsActions.actionPrintFormDutyMission>;
  actionLoadOrderAndTechnicalOperationById: HandleThunkActionCreator<typeof missionsActions.actionLoadOrderAndTechnicalOperationById>;
  actionSetDependenceOrderDataForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceOrderDataForDutyMission>;
};
export type OwnDutyMissionProps = {
  element: Partial<DutyMission> | null;
  handleHide: OnFormHideType;
  readOnly?: boolean;

  page: string;
  path?: string;
};

export type PropsDutyMissionWithForm = (
  StatePropsDutyMission
  & DispatchPropsDutyMission
  & OwnDutyMissionProps
);

export type PropsDutyMissionForm = OutputWithFormProps<
  PropsDutyMissionWithForm,
  DutyMission,
  any,
  any
>;
export type StateDutyMission = {
};
