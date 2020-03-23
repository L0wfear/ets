import * as React from 'react';
import { get } from 'lodash';
import { isArray } from 'util';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { BatteryAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { SchemaType, NumberPropertie } from 'components/old/ui/form/new/@types/validate.h';
import { TypesHarvestingUnit } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

const seasonOptions = [
  { value: 'Лето', label: 'Лето' },
  { value: 'Зима', label: 'Зима' },
  { value: 'Всесезон', label: 'Всесезон' },
];

export const validationSchema: SchemaType<TypesHarvestingUnit, any> = {
  properties: {
    type: {
      title: 'Тип прицепа, навесного уборочного агрегата',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    will_checked_cnt: {
      title: 'Всего подлежит подготовке',
      type: 'number',
      integer: true,
      required: true,
    },
    season: {
      title: 'Сезон',
      type: 'string',
      required: true,
    },
    ready_cnt: {
      title: 'Готово к сезону',
      type: 'number',
      integer: true,
      required: true,
    },
    not_ready_cnt: {
      title: 'Не готово к сезону',
      type: 'number',
      integer: true,
      required: false,
    },
  },
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

type IPropsSelectRenderer = {
  vehicleList: Array<BatteryAvailableCar>;
} & IPropsDataTableInputRenderer;

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
  const properties = values?.validationSchema?.properties;

  let propertiesElem: NumberPropertie<any, any, any> = null;
  if (properties) {
    if (isArray(properties)) {                      // если уверен, что это точно объект, то удали
      propertiesElem = properties.find(
        (elem) => elem.key === fieldKey,
      );
    } else {
      propertiesElem = properties[fieldKey] as NumberPropertie<any, any, any>;
    }
  }
  const inputType = get(propertiesElem, 'type', 'string');

  return (<ExtField id={`${index}_${fieldKey}`} type={inputType} label={false} value={value} error={get(outputListErrors[index], fieldKey, '')} onChange={onChange} boundKeys={[index, fieldKey]} disabled={!isPermitted} />);
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
