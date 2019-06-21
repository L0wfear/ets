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

const seasonOptions = [
  { value: 'Лето', label: 'Лето' },
  { value: 'Зима', label: 'Зима' },
  { value: 'Всесезон', label: 'Всесезон' },
];

export const validationSchema: IValidationSchema = {
  properties: [
    {
      key: 'type',
      title: 'Тип прицепа, навесного уборочного агрегата',
      type: 'string',
      required: false,
      maxLength: 128,
    },
    {
      key: 'will_checked_cnt',
      title: 'Всего подлежит подготовке',
      type: 'number',
      integer: true,
      required: false,
    },
    {
      key: 'season',
      title: 'Сезон',
      type: 'string',
      required: false,
    },
    {
      key: 'ready_cnt',
      title: 'Готово к сезону',
      type: 'number',
      integer: true,
      required: false,
    },
    {
      key: 'not_ready_cnt',
      title: 'Не готово к сезону',
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
      displayName: 'Тип прицепа, навесного уборочного агрегата',
      type: 'input',
      cssClassName: 'width300',
    },
    {
      name: 'will_checked_cnt',
      displayName: 'Всего подлежит подготовке',
      type: 'input',
    },
    {
      name: 'season',
      displayName: 'Сезон',
      type: 'select',
      cssClassName: 'width300',
    },
    {
      name: 'ready_cnt',
      displayName: 'Готово к сезону',
      type: 'input',
    },
    {
      name: 'not_ready_cnt',
      displayName: 'Не готово к сезону',
      type: 'input',
    },
  ],
};

interface IPropsSelectRenderer extends IPropsDataTableInputRenderer {
  vehicleList: IBatteryAvailableCar[];
}

const SelectRenderer: React.FC<IPropsSelectRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
  fieldKey,
}) => (
  <ExtField
    type="select"
    label={false}
    options={vehicleList}
    value={value}
    error={get(outputListErrors[index], fieldKey, '')}
    onChange={onChange}
    boundKeys={[index, fieldKey]}
    disabled={!isPermitted}
  />
);

const InputRenderer: React.FC<IPropsDataTableInputRenderer> = (values) => {
  const { value, onChange, index, outputListErrors, isPermitted, fieldKey } = values;
  const properties = get(values , 'validationSchema.properties', []);
  const inputType = get(properties.find((elem) => elem.key === fieldKey), 'type', 'string');
  return (<ExtField id={fieldKey} type={inputType} label={false} value={value} error={get(outputListErrors[index], fieldKey, '')} onChange={onChange} boundKeys={[index, fieldKey]} disabled={!isPermitted} />);
};
// "type": "ПУ", // Тип прицепа, навесного уборочного агрегата'
// "will_checked_cnt": 10, // Всего подлежит подготовке
// "season": "Лето", // Сезон (Всесезон, Лето, Зима)
// "ready_cnt": 5, // Готово к сезону
// "not_ready_cnt": 3, // Не готово к сезону
export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    type: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='type'
      />
    ),
    will_checked_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='will_checked_cnt'
      />
    ),
    season: (rowMeta) => {
      return (
        <SelectRenderer
          {...props}
          onChange={onListItemChange}
          value={rowMeta.data}
          index={rowMeta.rowData.rowNumber - 1}
          vehicleList={seasonOptions}
          fieldKey='season'
        />);
    },
    ready_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='ready_cnt'
      />
    ),
    not_ready_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='not_ready_cnt'
      />
    ),
  };
};
