import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type StateFieldForemanIdDutyMission = {
  FOREMANS: DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean }>[];
};

export type StatePropsFieldForemanIdDutyMission = {
  employeeList: IStateEmployee['employeeList'];
  employeeIndex: IStateEmployee['employeeIndex'];
};
export type DispatchPropsFieldForemanIdDutyMission = {
};

export type OwnPropsFieldForemanIdDutyMission = {
  value: DutyMission['foreman_id'];
  foreman_fio: DutyMission['foreman_fio'];
  foreman_full_fio: DutyMission['foreman_full_fio'];
  name: string | void;
  disabled: boolean;
  error: string | void;
  isPermitted: boolean;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  structure_id: DutyMission['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldForemanIdDutyMission = (
  StatePropsFieldForemanIdDutyMission
  & DispatchPropsFieldForemanIdDutyMission
  & OwnPropsFieldForemanIdDutyMission
);
