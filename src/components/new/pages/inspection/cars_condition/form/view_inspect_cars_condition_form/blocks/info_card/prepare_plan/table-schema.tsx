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
      type: 'number',
    },
    {
      key: 'will_checked_cnt',
      title: 'Всего подлежит подготовке',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'allseason_use_cnt',
      title: 'Круглогодичного использования',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'only_summer_use_cnt',
      title: 'Используемая только в летний период',
      type: 'number',
      integer: true,
      required: true,
    },
  ],
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'type',
      displayName: 'Тип техники',
      type: 'select',
      cssClassName: 'width150',
    },
    {
      name: 'will_checked_cnt',
      displayName: 'Всего подлежит подготовке',
      type: 'input',
      cssClassName: 'width150',
    },
    {
      name: 'allseason_use_cnt',
      displayName: 'Круглогодичного использования',
      type: 'input',
    },
    {
      name: 'only_summer_use_cnt',
      displayName: 'Используемая только в летний период',
      type: 'input',
    },
  ],
};

interface IPropsTypeRenderer extends IPropsDataTableInputRenderer {
  vehicleList: IBatteryAvailableCar[];
}

const TypeRenderer: React.FunctionComponent<IPropsTypeRenderer> = ({
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
    error={get(outputListErrors[index], 'car_id', '')}
    onChange={onChange}
    boundKeys={[index, 'car_id']}
    disabled={!isPermitted}
  />
);

const InputRenderer: React.FunctionComponent<
  IPropsDataTableInputRenderer
> = ({ value, onChange, index, outputListErrors, isPermitted, fieldKey }) => (
  <ExtField
    id={fieldKey}
    type="string"
    label={false}
    value={get(value, 'target.value', null)}
    error={get(outputListErrors[index], fieldKey, '')}
    onChange={onChange}
    boundKeys={[index, fieldKey]}
    disabled={!isPermitted}
  />
);

export const renderers: TRendererFunction = (props, onListItemChange) => {
  // const inputList = props.inputList.filter((filterItem) =>
  //   Boolean(filterItem.gov_number),
  // );
  // debugger
  // const vehicleList = [...props.batteryAvailableCarList, ...inputList].map(
  //   ({ car_id, gov_number }) => ({ label: gov_number, value: car_id }),
  // );

  // {
  //   name: 'type',
  //   displayName: 'Тип техники',
  //   type: 'select',
  //   cssClassName: 'width150',
  // },
  // {
  //   name: 'will_checked_cnt',
  //   displayName: 'Всего подлежит подготовке',
  //   type: 'input',
  //   cssClassName: 'width150',
  // },
  // {
  //   name: 'allseason_use_cnt',
  //   displayName: 'Круглогодичного использования',
  //   type: 'input',
  // },
  // {
  //   name: 'only_summer_use_cnt',
  //   displayName: 'Используемая только в летний период',
  //   type: 'input',
  // },

  return {
    type: (rowMeta) => (
      <TypeRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        vehicleList={[]}
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
    uninstalled_at: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='uninstalled_at'
      />
    ),
    odometr_start: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='odometr_start'
      />
    ),
  };
};
