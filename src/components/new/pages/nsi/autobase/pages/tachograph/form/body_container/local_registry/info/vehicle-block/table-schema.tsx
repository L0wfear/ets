import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { TachographAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const validationSchema: SchemaType<
  ValuesOf<TachographListWithOuterProps['tachograph_on_car']>,
  any
> = {
  properties: {
    car_id: {
      title: 'Рег. номер ТС',
      type: 'number',
      required: true,
    },
    install_company_name: {
      title: 'Фирма-установщик',
      type: 'string',
      required: true,
    },
    installed_at: {
      title: 'Дата монтажа',
      type: 'date',
      required: true,
    },
    activated_at: {
      title: 'Дата активации',
      type: 'date',
      required: true,
    },
    uninstalled_at: {
      title: 'Дата демонтажа',
      type: 'date',
      required: true, // переделать
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
      name: 'install_company_name',
      displayName: 'Фирма-установщик',
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
      name: 'activated_at',
      displayName: 'Дата активации',
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

type IPropsCarIdRenderer = {
  vehicleList: Array<TachographAvailableCar>;
  isLoading: boolean;
} & IPropsDataTableInputRenderer;

const CarIdRenderer: React.FC<IPropsCarIdRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
  isLoading,
}) => {

  const handleChange = (valueNew, option) => {
    onChange(index, {
      car_id: valueNew,
      gov_number: get(option, 'rowData.gov_number', null),
      company_id: get(option, 'rowData.company_id', null),
    });
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

const InstallCompanyNameRenderer: React.FC<IPropsCarIdRenderer> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index]
  );
  return (
    <ExtField
      type="string"
      label={false}
      value={value}
      error={get(outputListErrors[index], 'install_company_name', '')}
      onChange={handleChange}
      disabled={!isPermitted}
      boundKeys="install_company_name"
    />
  );
};

const InstalledAtRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  outputListErrors = [],
  isPermitted,
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index]
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

const ActivatedAtRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  isPermitted,
  outputListErrors = [],
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index]
  );

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      onChange={handleChange}
      boundKeys="activated_at"
      disabled={!isPermitted}
      error={get(outputListErrors[index], 'activated_at', '')}
      makeGoodFormat
    />
  );
};

const UninstalledAtRenderer: React.FC<IPropsDataTableInputRenderer> = ({
  value,
  onChange,
  index,
  isPermitted,
  outputListErrors = [],
}) => {
  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index]
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
  const vehicleList = props.tachographAvailableCarList;
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
    install_company_name: (rowMeta) => (
      <InstallCompanyNameRenderer
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
    activated_at: (rowMeta) => (
      <ActivatedAtRenderer
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
        index={rowMeta?.rowData?.rowNumber - 1}
      />
    ),
  };
};
