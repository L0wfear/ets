import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { BatteryAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { TypesСar } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const validationSchema: SchemaType<TypesСar, any> = {
  properties: {
    type: {
      title: 'Тип техники',
      type: 'string',
      required: true,
    },
    will_checked_cnt: {
      title: 'Всего подлежит подготовке',
      type: 'number',
      integer: true,
      required: true,
    },
    allseason_use_cnt: {
      title: 'Круглогодичного использования',
      type: 'number',
      integer: true,
      required: true,
    },
    checks_period_use_cnt: {
      title: 'В выбранный период',
      type: 'number',
      integer: true,
      required: true,
    },
  },
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
      displayName: 'В выбранный период',
      type: 'input',
    },
  ],
};

type IPropsTypeRenderer = {
  vehicleList: Array<BatteryAvailableCar>;
} & IPropsDataTableInputRenderer;

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

  return (<ExtField id={fieldKey} type={inputType} label={false} value={value} error={get(outputListErrors[index], fieldKey, '')} onChange={onChange} boundKeys={[index, fieldKey]} disabled={!isPermitted} />);
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
