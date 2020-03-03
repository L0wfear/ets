import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsDutyMissionTemplate = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
  employeeIndex: IStateEmployee['employeeIndex'];
  STRUCTURE_FIELD_VIEW: ReturnType<typeof getSessionStructuresParams>['STRUCTURE_FIELD_VIEW'];
};

export type DispatchPropsDutyMissionTemplate = {
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
};
export type OwnDutyMissionTemplateProps = WithFormRegistrySearchAddProps<DutyMissionTemplate>;

export type PropsDutyMissionTemplateWithForm = (
  StatePropsDutyMissionTemplate
  & DispatchPropsDutyMissionTemplate
  & OwnDutyMissionTemplateProps
);

export type PropsDutyMissionTemplateForm = OutputWithFormProps<
  PropsDutyMissionTemplateWithForm,
  DutyMissionTemplate,
  any,
  any
>;
