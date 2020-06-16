import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

export type PropsCarFilterByText = {
  active: boolean;
  isOkrug: boolean;
  company_id: InitialStateSession['userData']['company_id'];
  carActualGpsNumberIndex: any;
};

export type StateCarFilterByText = {
  hidden: boolean;
  carActualGpsNumberIndex: Record<string, Car>;
  carFilterMultyTypeOptions: Array<IReactSelectOption>;
  carFilterMultyTechConditionOptions: Array<IReactSelectOption>;
  carFilterMultyModelOptions: Array<IReactSelectOption>;
  carFilterMultyStructureOptions: Array<IReactSelectOption>;
  carFilterMultyOwnerOptions: Array<IReactSelectOption>;
};

export type DefOneAnsData = {
  obj: {[id: string]: string;};
  arr: Array<IReactSelectOption>;
};

export type CheckByIdAndNameFunc = (
  store: DefOneAnsData,
  id: number | void,
  name: string | void,
) => DefOneAnsData;
