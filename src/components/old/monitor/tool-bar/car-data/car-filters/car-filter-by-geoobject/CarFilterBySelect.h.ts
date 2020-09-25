import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';

export type PropsCarFilterByText = {
  active: boolean;
  permissions: Array<string>;
};

export type StateCarFilterByText = {
  hidden: boolean;
  FILTRED_GEOOBJECTS_LIST: Array<string>;
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
