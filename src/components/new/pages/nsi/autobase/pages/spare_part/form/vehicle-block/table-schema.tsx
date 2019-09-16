import * as React from 'react';
import { get, uniqBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IValidationSchema } from 'components/old/ui/form/@types/validation.h';
import { ISpareAvailableCar } from 'api/@types/services/autobase.h';

export const validationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Рег. номер ТС',
      type: 'number',
      required: true,
    },
    {
      key: 'count_part',
      title: 'Количество',
      type: 'number',
      required: true,
    },
    {
      key: 'installed_at',
      title: 'Дата монтажа',
      type: 'date',
      required: true,
    },
  ],
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'car_id',
      displayName: 'Рег. номер ТС',
      type: 'select',
      cssClassName: 'width200',
    },
    {
      name: 'count_part',
      displayName: 'Количество',
      type: 'number',
      cssClassName: 'width200',
    },
    {
      name: 'installed_at',
      displayName: 'Дата монтажа',
      type: 'date',
      cssClassName: 'width200',
    },
    {
      name: 'uninstalled_at',
      displayName: 'Дата демонтажа',
      type: 'date',
      cssClassName: 'width200',
    },
  ],
};

interface IPropsCarIdRenderer extends IPropsDataTableInputRenderer {
  vehicleList: ISpareAvailableCar[];
}

const CarIdRenderer: React.FC<IPropsCarIdRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
}) => {
  const handleChange = (valueNew, option) => {
    onChange(
      index,
      {
        car_id: valueNew,
        gov_number: get(option, 'rowData.gov_number', null),
        company_id: get(option, 'rowData.company_id', null),
      },
    );
  };

  return (
    <ExtField
      type="select"
      label={false}
      options={vehicleList}
      value={value}
      error={get(outputListErrors[index], 'car_id', '')}
      onChange={handleChange}
      disabled={!isPermitted}
    />
  );
};

const InstalledAtRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors,
  isPermitted,
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index],
  );
  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      error={get(outputListErrors[index], 'installed_at', '')}
      onChange={handleChange}
      boundKeys="installed_at"
      disabled={!isPermitted}
      makeGoodFormat
    />
  );
};

const CountPartRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors,
  isPermitted,
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index],
  );
  return (
    <ExtField
      id="count_part"
      type="string"
      label={false}
      value={value}
      error={get(outputListErrors[index], 'count_part', '')}
      disabled={!isPermitted}
      onChange={handleChange}
      boundKeys="count_part"
    />
  );
};

const UninstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, onChange, index, isPermitted, outputListErrors }) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index],
  );

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      onChange={handleChange}
      boundKeys="uninstalled_at"
      disabled={!isPermitted}
      error={get(outputListErrors[index], 'uninstalled_at', '')}
      makeGoodFormat
    />
  );
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  const inputList = props.inputList.filter((filterItem) =>
    Boolean(filterItem.gov_number),
  );
  const vehicleList = uniqBy(
    [...props.spareAvailableCarList, ...inputList].map(
      (rowData) => ({ label: rowData.gov_number, value: rowData.car_id, rowData }),
    ),
    'value',
  );

  return {
    car_id: (rowMeta) => (
      <CarIdRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        vehicleList={vehicleList}
      />
    ),
    count_part: (rowMeta) => (
      <CountPartRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    installed_at: (rowMeta) => (
      <InstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
    uninstalled_at: (rowMeta) => (
      <UninstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
  };
};
