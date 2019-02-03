import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { IStateEmployee, Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { HandleThunkActionCreator } from 'react-redux';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type StateFieldBrigadeEmployeeIdListDutyMissionTemplate = {
  BRIGADE: DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean }>[];
};

export type StatePropsFieldBrigadeEmployeeIdListDutyMissionTemplate = {
  employeeList: IStateEmployee['employeeList'];
  employeeIndex: IStateEmployee['employeeIndex'];
};
export type DispatchPropsFieldBrigadeEmployeeIdListDutyMissionTemplate = {
  actionLoadLastBrigade: HandleThunkActionCreator<typeof employeeActions.actionLoadLastBrigade>;
};

export type OwnPropsFieldBrigadeEmployeeIdListDutyMissionTemplate = {
  brigade_employee_id_list: DutyMissionTemplate['brigade_employee_id_list'];
  value: DutyMissionTemplate['brigade_employee_id_list_id'];
  name: DutyMissionTemplate['brigade_employee_id_list_fio'];
  isPermitted: boolean;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key in keyof DutyMissionTemplate]?: DutyMissionTemplate[key] }) => void;

  foreman_id: DutyMissionTemplate['foreman_id'];
  structure_id: DutyMissionTemplate['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldBrigadeEmployeeIdListDutyMissionTemplate = (
  StatePropsFieldBrigadeEmployeeIdListDutyMissionTemplate
  & DispatchPropsFieldBrigadeEmployeeIdListDutyMissionTemplate
  & OwnPropsFieldBrigadeEmployeeIdListDutyMissionTemplate
);
