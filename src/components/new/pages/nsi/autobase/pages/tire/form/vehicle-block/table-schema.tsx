import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { TireAvailableCar, Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { metresToKilometeres } from 'utils/functions';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const validationSchema: SchemaType<ValuesOf<Tire['tire_to_car']>, any> = {
  properties: {
    car_id: {
      title: 'Рег. номер ТС',
      type: 'number',
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
      name: 'car_id',
      displayName: 'Рег. номер ТС',
      type: 'select',
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
    {
      name: 'odometr_diff',
      displayName: 'Пробег, км',
      type: 'text',
      cssClassName: 'width200',
    },
    {
      name: 'sum_track_length',
      displayName: 'Пробег по ГЛОНАСС, км',
      type: 'text',
      cssClassName: 'width200',
    },
    {
      name: 'motohours_diff',
      displayName: 'Наработка, мч',
      type: 'text',
      cssClassName: 'width200',
    },
  ],
};

type IPropsCarIdRenderer = {
  vehicleList: Array<TireAvailableCar>;
  isLoading: boolean;
} & IPropsDataTableInputRenderer;

const CarIdRenderer: React.FC<IPropsCarIdRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
  isLoading
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
      etsIsLoading={isLoading}
    />
  );
};

const InstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, onChange, index, outputListErrors, isPermitted }) => {
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

  const vehicleList = props.tireAvailableCarList;
  const isLoading = props.isLoading;
  return {
    car_id: (rowMeta) => (
      <CarIdRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        vehicleList={vehicleList}
        isLoading={isLoading}
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
    sum_track_length: (rowMeta) => (
      <React.Fragment>
        {
          metresToKilometeres(rowMeta.data)
        }
      </React.Fragment>
    ),
  };
};
