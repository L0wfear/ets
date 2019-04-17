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
      key: 'only_summer_use_cnt',
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
  isDefaultVal,
}) => (
  <ExtField
    type="select"
    label={false}
    options={vehicleList}
    value={value}
    error={get(outputListErrors[index], 'type', '')}
    onChange={onChange}
    boundKeys={[index, 'type']}
    disabled={!isPermitted || isDefaultVal}
  />
);

const InputRenderer: React.FC<IPropsDataTableInputRenderer> = ({ value, onChange, index, outputListErrors, isPermitted, fieldKey }) => (
  <ExtField
    id={fieldKey}
    type="string"
    label={false}
    value={value}
    error={get(outputListErrors[index], fieldKey, '')}
    onChange={onChange}
    boundKeys={[index, fieldKey]}
    disabled={!isPermitted}
  />
);

export const renderers: TRendererFunction = (props, onListItemChange) => {
  return {
    type: (rowMeta) => {
      return (
        <TypeRenderer
          {...props}
          onChange={onListItemChange}
          value={rowMeta.data}
          index={rowMeta.rowData.rowNumber - 1}
          vehicleList={props.typesListOpt}
          isDefaultVal={rowMeta.rowData.isDefaultVal}
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
    only_summer_use_cnt: (rowMeta) => (
      <InputRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        fieldKey='only_summer_use_cnt'
      />
    ),
  };
};
