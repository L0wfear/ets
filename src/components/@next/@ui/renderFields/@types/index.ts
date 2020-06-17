import { DatePickerProps } from 'components/old/ui/input/date-picker/DatePicker';
import { IPropsFileInput } from 'components/old/ui/input/FileInput/FileInput.h';
import { glyphMap } from '../../../../../global-styled';

export type ExtFieldCommon<V = any> = {
  showBtn?: boolean;
  btnProps?: any;
  ref?: any;
  id?: any;
  label?: string | boolean;
  error?: string | boolean;
  onChange?: (...arg: Array<any>) => void;
  onBlur?: (...arg) => void;

  disabled?: boolean;
  value?: V;
  boundKeys?: any | Array<any>;
  className?: string;
  modalKey?: string;
  hidden?: boolean;
  readOnly?: boolean;
  value_string?: string | number;
  format?: 'toFixed2'
          | 'toFixed3' // разделяем отображение данных и значения, используя формат
          | 'number';

  emptyValue?: any; // надо ли
};
export type ExtFieldSelect<V = any> = ExtFieldCommon<V> & {
  type: 'select';
  clearable?: boolean;
  multi?: boolean;
  options: Array<any>; // DefaultSelectOption<V, any, any>[] | any[];
  placeholder?: string;

  sortingFunction?: any;
  multiValueContainerReander?: any; // плохо
  etsIsLoading?: boolean;

  emptyValue?: any;

  filterOption?: any;
  legacy?: boolean;
  components?: any; // нужно описать

  hint?: string | React.ReactNode;
};
export type ExtFieldDate<V = any> = ExtFieldCommon<V> & {
  type: 'date';
  date?: any; // нужно избавиться
  value?: any;
  time?: boolean;
  minHeightLabel?: number;

  min?: any; // Работает????

  makeGoodFormat?: boolean; // валидный формат даты при изменении
  preventDateTime?: boolean; // всегда datetime
} & Partial<DatePickerProps>;

export type ExtFieldBoolean<V = any> = ExtFieldCommon<V> & {
  type: 'boolean';
  checked?: any;
  checkboxStyle?: any;
};

export type ExtFieldString<V = any> = ExtFieldCommon<V> & {
  type: 'string';
  inline?: boolean;
  isLoading?: boolean;
  wrapStyle?: any;
  hint?: string;
  maxLength?: number;
  placeholder?: string;
  addonRight?: string;
};

export type ExtFieldNumber<V = any> = ExtFieldCommon<V> & {
  type: 'number';
  showRedBorder?: boolean;

  addonRight?: string;
};

export type ExtFieldText<V = any> = ExtFieldCommon<V> & {
  type: 'text';

  textAreaStyle?: any;
  rows?: number;
};

export type ExtFieldFile<V = any> = ExtFieldCommon<V> & {
  type: 'file';
  boundKeys: any;
  kind: string;
} & IPropsFileInput;

export type ExtFieldTypeByKey = {
  select: ExtFieldSelect;
  date: ExtFieldDate;
  boolean: ExtFieldBoolean;
  string: ExtFieldString;
  number: ExtFieldNumber;
  text: ExtFieldText;
  file: ExtFieldFile;
};

export type ExtFieldButton = {
  title?: string;
  disabled?: boolean;
  onClick?: (obj: { [key: string]: any; }) => any;
  glyph?: keyof typeof glyphMap;
};

export type ExtFieldType = ExtFieldTypeByKey[keyof ExtFieldTypeByKey];
