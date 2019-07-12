import Field from 'components/ui/Field';
import { onChangeWithKeys } from 'components/compositions/hoc';
import withMergeProps from 'components/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

type ExtFieldCommon<V = any> = {
  rel?: any;
  id?: any;
  label?: string | boolean;
  error?: string | boolean | void;
  onChange?: (...arg: any[]) => void;
  disabled?: boolean;
  value?: V,
  boundKeys?: any | any[];
  className?: string;
  modalKey?: string;

  emptyValue?: any; // надо ли
};
type ExtFieldSelect<V = any> = ExtFieldCommon<V> & {
  type: 'select';
  clearable?: boolean;
  multi?: boolean,
  options: any; // DefaultSelectOption<V, any, any>[] | any[];
  placeholder?: string;

  sortingFunction?: any;
  multiValueContainerReander?: any; // плохо
  etsIsLoading?: boolean;

  emptyValue?: any;

  filterOption?: any;
  legacy?: boolean;
  components?: any; // нужно описать
};
type ExtFieldDate<V = any> = ExtFieldCommon<V> & {
  type: 'date';
  date?: any; // нужно избавиться
  value?: any;
  time?: boolean;

  makeGoodFormat?: boolean; // валидный формат даты при изменении
  preventDateTime?: boolean; // всегда datetime
};

type ExtFieldBoolean<V = any> = ExtFieldCommon<V> & {
  type: 'boolean';
  checked?: any;
  checkboxStyle?: any;
};

type ExtFieldString<V = any> = ExtFieldCommon<V> & {
  type?: 'string';
  readOnly?: boolean;
  inline?: boolean;

  maxlength?: number;
  placeholder?: string;
};

type ExtFieldNumber<V = any> = ExtFieldCommon<V> & {
  type?: 'number';
};

type ExtFieldText<V = any> = ExtFieldCommon<V> & {
  type?: 'text';

  textAreaStyle?: any;
  rows?: number;
};

type ExtFieldType = (
  ExtFieldSelect
  | ExtFieldDate
  | ExtFieldBoolean
  | ExtFieldString
  | ExtFieldNumber
  | ExtFieldText
);

export const ExtField: React.ComponentClass<ExtFieldType> = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props,
  )(Field as any),
);
