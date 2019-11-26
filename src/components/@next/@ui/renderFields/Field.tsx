import * as React from 'react';
import { isArray, isNullOrUndefined } from 'util';

import StringField from 'components/@next/@ui/renderFields/StringField/StringField';
import TextAreaField from 'components/@next/@ui/renderFields/TextAreaField/TextAreaField';
import CheckBoxField from 'components/@next/@ui/renderFields/CheckBoxField/CheckBoxField';
import NumberField from 'components/@next/@ui/renderFields/NumberField/NumberField';
import DateField from 'components/@next/@ui/renderFields/DateField/DateField';
import FileField from 'components/@next/@ui/renderFields/FileField/FileField';
import SelectField from 'components/@next/@ui/renderFields/SelectField/SelectField';
import { ExtFieldType, ExtFieldTypeByKey } from 'components/@next/@ui/renderFields/@types';

const ComponentByType: { [K in keyof ExtFieldTypeByKey]: React.ComponentType<ExtFieldTypeByKey[K]> } = {
  string: StringField,
  text: TextAreaField,
  select: SelectField,
  date: DateField,
  file: FileField,
  number: NumberField,
  boolean: CheckBoxField,
};

const ExtField: React.FC<ExtFieldType> = React.memo(
  ({ boundKeys, ...props }) => {
    const Component = ComponentByType[props.type] || ComponentByType.string;

    const [ isFocus, setIsFocus ] = React.useState(false);
    const [ localStateValue, setLocalStateValue ] = React.useState(props.value);

    const onChange = React.useCallback(
      (...arg) => {
        if (props.onChange) {
          const addKeys = !isNullOrUndefined(boundKeys) ? boundKeys : [];
          if (!isArray(addKeys)) {
            props.onChange(addKeys, ...arg);
          } else {
            props.onChange(...addKeys, ...arg);
          }
        }
        setLocalStateValue(props.value);
      },
      [boundKeys, props.onChange, props.value,],
    );

    const onFocus = React.useCallback( (...arg) => {
      setIsFocus(true);
    }, [isFocus]);

    const onBlur = React.useCallback(
      () => {
        setIsFocus(false);
        setLocalStateValue(props.value);
      },
      [boundKeys, props.onBlur, props.format, props.value],
    );

    React.useEffect( () => {
      setLocalStateValue(props.value);
    }, [isFocus, props.type, props.value]);

    // выводить 3 знака после запятой { format === 'toFixed3', type === 'number', }
    React.useEffect( () => {
      if (!isFocus
        && props.format === 'toFixed3'
        && props.type === 'number'
        && !isNullOrUndefined(props.value)
        && (props.value || props.value === 0)
      ){
        const newVal = Number(props.value).toFixed(3);
        if(Number(props.value).toString()?.split('.')?.[1]?.length <= 3) { // Если пользак ввел больше 3x знаков, то не перетираем state
          setLocalStateValue(newVal);
        }
      }
    }, [isFocus, props.format, props.type, props.value]);

    // меняем точку на запятую во всех полях type === 'number'
    React.useEffect( () => {
      if (!isFocus
        && !props.format
        && props.type === 'number'
        && !isNullOrUndefined(props.value)
        && (props.value || props.value === 0)
      ){
        const newVal = Number(props.value).toString().replace('.', ',');
        setLocalStateValue(newVal);
      }
    }, [isFocus, props.format, props.type, props.value]);

    if (props.disabled && props.value_string) {
      return (
        <StringField
          {...props as any}
          type="string"
          value={props.value_string.toString()}
        />
      );
    }

    return (
      <Component {...props as any} value={isFocus ? props.value : localStateValue} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
    );
  },
);

export default ExtField;
