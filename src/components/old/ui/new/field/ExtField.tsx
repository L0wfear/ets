import * as React from 'react';
import Field from 'components/old/ui/Field';
import { onChangeWithKeys } from 'components/old/compositions/hoc';

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
  value_string?: string;

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
  ({ boundKeys, ...props }) => {
    if (props.disabled && props.value_string) {
      return (
        <Field
          {...props}
          type="string"
          value={props.value_string}
        />
      );
    }

    return (
      <Field {...props} />
    );
  },
);
