import { HandleThunkActionCreator } from 'react-redux';

import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

export type StatePropsDutyMission = {
  STRUCTURE_FIELD_VIEW: ReturnType<
    typeof getSessionStructuresParams
  >['STRUCTURE_FIELD_VIEW'];
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  edcRequest: IStateMissions['dutyMissionData']['edcRequest'];
  dependeceOrder: IStateMissions['dutyMissionData']['dependeceOrder'];
};

export type DispatchPropsDutyMission = {
  dispatch: EtsDispatch;
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
  actionPrintFormDutyMission: HandleThunkActionCreator<typeof missionsActions.actionPrintFormDutyMission>;
  actionLoadOrderAndTechnicalOperationByIdForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionLoadOrderAndTechnicalOperationByIdForDutyMission>;
  actionSetDependenceOrderDataForDutyMission: HandleThunkActionCreator<typeof missionsActions.actionSetDependenceOrderDataForDutyMission>;
  loadEdcRequiedByIdForDutyMission: HandleThunkActionCreator<typeof missionsActions.loadEdcRequiedByIdForDutyMission>;
  actionReseSetDependenceMissionDataForDutyMissionForm: HandleThunkActionCreator<typeof missionsActions.actionReseSetDependenceMissionDataForDutyMissionForm>;
  actionGetAndSetInStoreMoscowTimeServer: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreMoscowTimeServer>;
  actionResetMoscowTimeServer: HandleThunkActionCreator<typeof someUniqActions.actionResetMoscowTimeServer>;
};
export type OwnDutyMissionProps = (
  {
    formState: DutyMission;
    page: string;
    path: string;
    handleHide: (isSubmitted: any, result?: DutyMission | Partial<DutyMission> | any) => any;
    handleChange: (partialFormState: Partial<DutyMission> | keyof DutyMission, value?: DutyMission[keyof DutyMission]) => any;
    formErrors: Partial<Record<keyof DutyMission, string>>;
    canSave: boolean;
    isPermitted: boolean;
    updateFormErrors: () => any;
    submitAction: (mission: DutyMission) => Promise<any>;
    defaultSubmit: () => Promise<any>;

    formDataKey: FormKeys & 'duty_mission';  // ключ к стору
  }
  & {
    readOnly?: boolean;
  }
);

export type PropsDutyMissionForm = StatePropsDutyMission &
  DispatchPropsDutyMission &
  OwnDutyMissionProps;

export type StateDutyMission = {};
