import {
  IReactSelectOption,
} from 'components/ui/@types/ReactSelect.h';

export type PropsDefaultInput = {
  value: number[];
  keyField: string;
  changeFilter: any;
  OPTIONS: IReactSelectOption[];
  placeholder: string;
};
