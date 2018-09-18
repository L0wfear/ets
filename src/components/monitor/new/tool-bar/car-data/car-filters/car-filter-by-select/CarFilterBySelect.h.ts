import {
  CarActualAsuodsIdIndexType,
} from 'redux/trash-actions/car/car.h';

import {
  IReactSelectOption
} from 'components/ui/@types/ReactSelect.h';

export type PropsCarFilterByText = {
  changeCarFilterMulty: Function;
  active: boolean;
  isOkrug: boolean;
};

export type StateCarFilterByText = {
  hidden: boolean;
  carActualGpsNumberIndex: CarActualAsuodsIdIndexType,
  carFilterMultyTypeOptions: IReactSelectOption[];
  carFilterMultyStructureOptions: IReactSelectOption[];
  carFilterMultyOwnerOptions: IReactSelectOption[];
};

export type DefOneAnsData = {
  obj: {[id: string]: string},
  arr: IReactSelectOption[],
}

export type DefAns = {
  carFilterMultyTypeOptions: DefOneAnsData,
  carFilterMultyStructureOptions: DefOneAnsData,
  carFilterMultyOwnerOptions: DefOneAnsData,
}

export type CheckByIdAndNameFunc = (
  store: DefOneAnsData,
  id: number | void,
  name: string | void,
) => DefOneAnsData;

export type MakeOptionsFunc = (
  carActualGpsNumberIndex: CarActualAsuodsIdIndexType,
) => DefAns;
