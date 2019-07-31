import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

export type PropsDutyMissionTemplateCreatingFormLazy = {
  showForm: boolean;
  element: Partial<DutyMission> | null;
  dutyMissionTemplates: Record<string, DutyMissionTemplate>;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsDutyMissionTemplate = {
  employeeIndex: IStateEmployee['employeeIndex'];
};

export type DispatchPropsDutyMissionTemplate = {
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
};
export type OwnDutyMissionTemplateProps = {
  element: Partial<DutyMission> | null;
  handleHide: OnFormHideType;
  dutyMissionTemplates: Record<string, DutyMissionTemplate>;

  page: string;
  path?: string;
};

export type PropsDutyMissionTemplateWithForm = (
  StatePropsDutyMissionTemplate
  & DispatchPropsDutyMissionTemplate
  & OwnDutyMissionTemplateProps
);

export type PropsDutyMissionTemplateCreatingForm = OutputWithFormProps<
  PropsDutyMissionTemplateWithForm,
  Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id' | 'mission_source_name'>,
  any,
  any
>;
export type StateDutyMissionTemplate = {};
