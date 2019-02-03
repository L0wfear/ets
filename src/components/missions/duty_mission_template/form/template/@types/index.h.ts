import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { HandleThunkActionCreator } from 'react-redux';

export type PropsDutyMissionTemplateFormLazy = {
  showForm: boolean;
  element: Partial<DutyMissionTemplate> | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsDutyMissionTemplate = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
};

export type DispatchPropsDutyMissionTemplate = {
  employeeGetAndSetInStore: HandleThunkActionCreator<typeof employeeActions.employeeGetAndSetInStore>;
  employeeEmployeeResetSetEmployee: HandleThunkActionCreator<typeof employeeActions.employeeEmployeeResetSetEmployee>;
};
export type OwnDutyMissionTemplateProps = {
  element: Partial<DutyMissionTemplate> | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

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
export type StateDutyMissionTemplate = {
};
