import * as React from 'react';
import Field from 'components/@next/@ui/renderFields/Field';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { DatePickerProps } from 'components/old/ui/input/date-picker/DatePicker';
import { IPropsFileInput } from 'components/old/ui/input/FileInput/FileInput.h';

export type ExtFieldCommon<V = any> = {
  rel?: any;
  id?: any;
  label?: string | boolean;
  error?: string | boolean;
  onChange?: (...arg: any[]) => void;
  disabled?: boolean;
  value?: V,
  boundKeys?: any | any[];
  className?: string;
  modalKey?: string;
  hidden?: boolean;
  readOnly?: boolean;

  emptyValue?: any; // надо ли
};
export type ExtFieldSelect<V = any> = ExtFieldCommon<V> & {
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
export type ExtFieldDate<V = any> = ExtFieldCommon<V> & {
  type: 'date';
  date?: any; // нужно избавиться
  value?: any;
  time?: boolean;
  minHeightLabel?: number;

  makeGoodFormat?: boolean; // валидный формат даты при изменении
  preventDateTime?: boolean; // всегда datetime
} & Partial<DatePickerProps>;

export type ExtFieldBoolean<V = any> = ExtFieldCommon<V> & {
  type: 'boolean';
  checked?: any;
  checkboxStyle?: any;
};

export type ExtFieldString<V = any> = ExtFieldCommon<V> & {
  type?: 'string';
  inline?: boolean;
  isLoading?: boolean;
  wrapStyle?: any;

  maxlength?: number;
  placeholder?: string;
};

export type ExtFieldNumber<V = any> = ExtFieldCommon<V> & {
  type?: 'number';
  showRedBorder?: boolean;
};

export type ExtFieldText<V = any> = ExtFieldCommon<V> & {
  type?: 'text';

  textAreaStyle?: any;
  rows?: number;
};

export type ExtFieldFile<V = any> = ExtFieldCommon<V> & {
  type?: 'file';
} & IPropsFileInput;

export type ExtFieldType = (
  ExtFieldSelect
  | ExtFieldDate
  | ExtFieldBoolean
  | ExtFieldString
  | ExtFieldNumber
  | ExtFieldText
  | ExtFieldFile
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
