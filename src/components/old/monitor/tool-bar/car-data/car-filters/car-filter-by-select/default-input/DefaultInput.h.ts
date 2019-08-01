import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';

export type PropsDefaultInput = {
  value: number[];
  keyField: string;
  changeFilter: any;
  OPTIONS: IReactSelectOption[];
  placeholder: string;
};
