import {
  IReactSelectOption,
} from 'components/ui/@types/ReactSelect.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type PropsCarFilterByText = {
  active: boolean;
  isOkrug: boolean;
  carActualGpsNumberIndex: any;
};

export type StateCarFilterByText = {
  hidden: boolean;
  carActualGpsNumberIndex: Record<string, Car>,
  carFilterMultyTypeOptions: IReactSelectOption[];
  carFilterMultyStructureOptions: IReactSelectOption[];
  carFilterMultyOwnerOptions: IReactSelectOption[];
};

export type DefOneAnsData = {
  obj: {[id: string]: string},
  arr: IReactSelectOption[],
};

export type CheckByIdAndNameFunc = (
  store: DefOneAnsData,
  id: number | void,
  name: string | void,
) => DefOneAnsData;
