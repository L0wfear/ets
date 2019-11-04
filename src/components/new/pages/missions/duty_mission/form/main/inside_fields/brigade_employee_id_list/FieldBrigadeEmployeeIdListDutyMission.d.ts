import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { IStateEmployee, Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { HandleThunkActionCreator } from 'react-redux';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export type StateFieldBrigadeEmployeeIdListDutyMission = {
  BRIGADE: Array<DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean; }>>;
};

export type StatePropsFieldBrigadeEmployeeIdListDutyMission = {
  employeeList: IStateEmployee['employeeList'];
  employeeIndex: IStateEmployee['employeeIndex'];
};
export type DispatchPropsFieldBrigadeEmployeeIdListDutyMission = {
  actionLoadLastBrigade: HandleThunkActionCreator<typeof employeeActions.actionLoadLastBrigade>;
};

export type OwnPropsFieldBrigadeEmployeeIdListDutyMission = {
  brigade_employee_id_list: DutyMission['brigade_employee_id_list'];
  value: DutyMission['brigade_employee_id_list_id'];
  name: DutyMission['brigade_employee_id_list_fio'];
  isPermitted: boolean;
  disabled: boolean;
  error: string;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  foreman_id: DutyMission['foreman_id'];
  structure_id: DutyMission['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldBrigadeEmployeeIdListDutyMission = (
  StatePropsFieldBrigadeEmployeeIdListDutyMission
  & DispatchPropsFieldBrigadeEmployeeIdListDutyMission
  & OwnPropsFieldBrigadeEmployeeIdListDutyMission
);
