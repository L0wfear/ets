import {
  IReactSelectOption
} from 'components/ui/@types/EtsSelect.h';

export type PropsDefaultInput = {
  value: number[];
  keyField: string;
  changeFilter: Function;
  OPTIONS: IReactSelectOption[];
}