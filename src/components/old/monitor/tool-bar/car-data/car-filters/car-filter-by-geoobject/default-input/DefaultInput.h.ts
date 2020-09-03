import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';

export type PropsDefaultInput = {
  value: Array<number>;
  keyField: string;
  changeFilter: any;
  OPTIONS: Array<IReactSelectOption>;
  placeholder: string;
};
