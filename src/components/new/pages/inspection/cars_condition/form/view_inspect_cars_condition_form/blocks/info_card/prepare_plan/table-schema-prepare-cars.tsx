import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/ui/table/DataTableInput/DataTableInput.h';
import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { IBatteryAvailableCar } from 'api/@types/services/autobase.h';

export const validationSchema: IValidationSchema = {
  properties: [
    {
      key: 'type',
      title: 'Тип техники',
      type: 'string',
      required: true,
    },
    {
      key: 'will_checked_cnt',
      title: 'Всего подлежит подготовке',
      type: 'number',
      integer: true,
      required: false,
    },
    {
      key: 'allseason_use_cnt',
      title: 'Круглогодичного использования',
      type: 'number',
      integer: true,
      required: false,
    },
    {
      key: 'checks_period_use_cnt',
      title: 'Используемая только в летний период',
      type: 'number',
      integer: true,
      required: false,
    },
  ],
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'type',
      displayName: 'Тип техники',
      type: 'select',
      cssClassName: 'width300',
    },
    {
      name: 'will_checked_cnt',
      displayName: 'Всего подлежит подготовке',
      type: 'input',
    },
    {
      name: 'allseason_use_cnt',
      displayName: 'Круглогодичного использования',
      type: 'input',
    },
    {
      name: 'checks_period_use_cnt',
      displayName: 'Используемая только в летний период',
      type: 'input',
    },
  ],
};

interface IPropsTypeRenderer extends IPropsDataTableInputRenderer {
  vehicleList: IBatteryAvailableCar[];
}

const TypeRenderer: React.FC<IPropsTypeRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
}) => (
  <ExtField
    type="select"
    label={false}
    options={vehicleList}
    value={value}
    error={get(outputListErrors[index], 'type', '')}
    onChange={onChange}
    boundKeys={[index, 'type']}
    disabled={!isPermitted}
  />
);

const InputRenderer: React.FC<IPropsDataTableInputRenderer> = (values) => {
  const { value, onChange, index, outputListErrors, isPermitted, fieldKey } = values;
  const properties = get(values , 'validationSchema.properties', []);
  const propertiesElem = properties.find(
    (elem) => elem.key === fieldKey,
  );
  const inputType = get(propertiesElem, 'type', 'string');
  const elemIsInteger = get(propertiesElem, 'integer', false);
  const newVal = (inputType === 'number' && elemIsInteger && value) // <<< в state всё равно записывается строка, замена на число в handleChangeTypesCars
  ? parseInt(value, 10)
  : (inputType === 'number' && !elemIsInteger)
    ? parseFloat(value)
    : value;

  return (<ExtField id={fieldKey} type={inputType} label={false} value={newVal} error={get(outputListErrors[index], fieldKey, '')} onChange={onChange} boundKeys={[index, fieldKey]} disabled={!isPermitted} />);
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    type: (rowMeta) => {
      return (
        <TypeRenderer
          {...props}
          isPermitted={props.isPermitted && !rowMeta.rowData.disabled}
          onChange={onListItemChange}
          value={rowMeta.data}
          index={rowMeta.rowData.rowNumber - 1}
          vehicleList={props.typesListOpt}
        />);
    },
    will_checked_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='will_checked_cnt'
      />
    ),
    allseason_use_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='allseason_use_cnt'
      />
    ),
    checks_period_use_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='checks_period_use_cnt'
      />
    ),
  };
};
