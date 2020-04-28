import * as React from 'react';
import { uniqBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const validationSchema: SchemaType<ValuesOf<BatteryRegistry['battery_to_car']>, any> = {
  properties: {
    car_id: {
      title: 'Рег. номер ТС',
      type: 'number',
      integer: true,
      required: true,
    },
    installed_at: {
      title: 'Дата монтажа',
      type: 'date',
      required: true,
    },
  },
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'installed_at',
      displayName: 'Дата монтажа',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'uninstalled_at',
      displayName: 'Дата демонтажа',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'car_id',
      displayName: 'Рег. номер ТС',
      type: 'select',
    },
    {
      name: 'odometr_start',
      displayName: 'Пробег на дату установки',
      type: 'input',
    },
  ],
};

type IPropsCarIdRenderer = {
  vehicleList: BatteryRegistry['battery_to_car'];
} & IPropsDataTableInputRenderer;

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
        gov_number: option?.rowData?.gov_number ?? null,
        company_id: option?.rowData?.company_id ?? null,
      },
    );
  };

  return (
    <ExtField
      type="select"
      label={false}
      options={vehicleList}
      value={value}
      error={outputListErrors[index]?.car_id ?? ''}
      onChange={handleChange}
      disabled={!isPermitted}
    />
  );
};

const InstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, outputListErrors, onChange, index, isPermitted }) => (
  <ExtField
    type="date"
    label={false}
    date={value}
    time={false}
    error={outputListErrors[index]?.installed_at ?? ''}
    onChange={onChange}
    boundKeys={[index, 'installed_at']}
    disabled={!isPermitted}
    makeGoodFormat
  />
);

const UninstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, outputListErrors, onChange, index, isPermitted }) => (
  <ExtField
    type="date"
    label={false}
    date={value}
    error={outputListErrors[index]?.uninstalled_at ?? ''}
    time={false}
    onChange={onChange}
    boundKeys={[index, 'uninstalled_at']}
    disabled={!isPermitted}
    makeGoodFormat
  />
);

const PropOnDateRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, onChange, index }) => (
  <ExtField
    type="string"
    label={false}
    error={false}
    value={value || '-'}
    onChange={onChange}
    boundKeys={[index, 'prob_on_date']}
    disabled={true}
  />
);

export const renderers: TRendererFunction = (props, onListItemChange) => {
  const inputList = props.inputList.filter((filterItem) =>
    Boolean(filterItem.gov_number),
  );
  const vehicleList = uniqBy(
    [...props.batteryAvailableCarList, ...inputList].map(
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
    odometr_start: (rowMeta) => (
      <PropOnDateRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />
    ),
  };
};
