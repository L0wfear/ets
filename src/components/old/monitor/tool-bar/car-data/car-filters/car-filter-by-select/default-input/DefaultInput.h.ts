import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';

export type DefaultInputTypes = 'multi'|'select'|'checkbox';

export type PropsDefaultInput = {
  value: Array<number>;
  keyField: string;
  changeFilter: any;
  OPTIONS: Array<IReactSelectOption>;
  placeholder: string;
  type: DefaultInputTypes;
  setRefreshCheckBoxFilter: React.Dispatch<React.SetStateAction<boolean>>;
};
