import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { IStateInspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export type DefaultPartInspect = {
  status: 'conducting' | 'completed';
  date_end: string;
};

export type TypeOfInspect = 'autobase' | 'pgm_base' | 'container' | 'cars_condition';

export type IStateInspect = {
  inspectAutobase: IStateInspectAutobase;
  inspectPgmBase: IStateInspectPgmBase;
  inspectCarsCondition: IStateInspectCarsCondition;
};
