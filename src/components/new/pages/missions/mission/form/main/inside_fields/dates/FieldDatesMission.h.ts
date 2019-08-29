import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type StateFieldDatesMission = {
};

export type StatePropsFieldDatesMission = {
};
export type DispatchPropsFieldDatesMission = {
  dispatch: EtsDispatch;
};

export type OwnPropsFieldDatesMission = {
  isPermitted: boolean;
  date_start: Mission['date_start'];
  error_date_start: string,
  date_end: Mission['date_end'];
  error_date_end: string,

  onChange: (obj: Partial<Mission>) => void;

  norm_ids: Mission['norm_ids'];
  is_cleaning_norm: Mission['is_cleaning_norm'];
  object_type_name: Mission['object_type_name'];

  IS_CREATING?: boolean;
  MISSION_IS_ORDER_SOURCE?: boolean;

  disabled: boolean;
  page: string;
  path: string;
};

export type PropsFieldDatesMission = (
  StatePropsFieldDatesMission
  & DispatchPropsFieldDatesMission
  & OwnPropsFieldDatesMission
);
