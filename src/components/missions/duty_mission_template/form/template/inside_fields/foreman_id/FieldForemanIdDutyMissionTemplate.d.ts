import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type StateFieldForemanIdDutyMissionTemplate = {
  FOREMANS: DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean }>[];
};

export type StatePropsFieldForemanIdDutyMissionTemplate = {
  employeeList: IStateEmployee['employeeList'];
  employeeIndex: IStateEmployee['employeeIndex'];
};
export type DispatchPropsFieldForemanIdDutyMissionTemplate = {
};

export type OwnPropsFieldForemanIdDutyMissionTemplate = {
  value: DutyMissionTemplate['foreman_id'];
  foreman_fio: DutyMissionTemplate['foreman_fio'];
  foreman_full_fio: DutyMissionTemplate['foreman_full_fio'];
  name: string | void;
  disabled: boolean;
  error: string | void;
  isPermitted: boolean;
  onChange: (obj: { [key in keyof DutyMissionTemplate]?: DutyMissionTemplate[key] }) => void;

  structure_id: DutyMissionTemplate['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldForemanIdDutyMissionTemplate = (
  StatePropsFieldForemanIdDutyMissionTemplate
  & DispatchPropsFieldForemanIdDutyMissionTemplate
  & OwnPropsFieldForemanIdDutyMissionTemplate
);
