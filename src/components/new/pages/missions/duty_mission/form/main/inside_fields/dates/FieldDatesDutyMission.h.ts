import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

export type StateFieldDatesDutyMission = {
};

export type StatePropsFieldDatesDutyMission = {
};
export type DispatchPropsFieldDatesDutyMission = {
};

export type OwnPropsFieldDatesDutyMission = {
  isPermitted: boolean;
  plan_date_start: DutyMission['plan_date_start'];
  error_plan_date_start: string,
  plan_date_end?: DutyMission['plan_date_end'];
  error_plan_date_end?: string,
  fact_date_start?: DutyMission['fact_date_start'];
  error_fact_date_start?: string,
  fact_date_end?: DutyMission['fact_date_end'];
  error_fact_date_end?: string,

  is_cleaning_norm?: DutyMission['is_cleaning_norm'];
  object_type_name?: DutyMission['object_type_name'];
  norm_id?: DutyMission['norm_id'];

  DUTY_MISSION_IS_DISPLAY?: boolean;
  DUTY_MISSION_IS_CLOSED?: boolean;
  DUTY_MISSION_IS_ASSIGNED?: boolean;
  DUTY_MISSION_IS_COMPLETED?: boolean;

  onChange: (obj: Partial<Pick<DutyMission, 'plan_date_start' | 'plan_date_end' | 'fact_date_start' | 'fact_date_end'>>) => void;

  page: string;
  path: string;
};

export type PropsFieldDatesDutyMission = (
  StatePropsFieldDatesDutyMission
  & DispatchPropsFieldDatesDutyMission
  & OwnPropsFieldDatesDutyMission
);
