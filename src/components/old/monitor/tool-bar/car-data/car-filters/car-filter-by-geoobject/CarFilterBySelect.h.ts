import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';

export type PropsCarFilterByText = {
  active: boolean;
};

export type StateCarFilterByText = {
  hidden: boolean;
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
