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
      key: 'car_id',
      title: 'Рег. номер ТС',
      type: 'number',
      integer: true,
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

interface IPropsCarIdRenderer extends IPropsDataTableInputRenderer {
  vehicleList: IBatteryAvailableCar[];
}

const CarIdRenderer: React.FC<IPropsCarIdRenderer> = ({
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

const InstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, outputListErrors, onChange, index, isPermitted }) => (
  <ExtField
    type="date"
    label={false}
    date={value}
    time={false}
    error={get(outputListErrors[index], 'installed_at', '')}
    onChange={onChange}
    boundKeys={[index, 'installed_at']}
    disabled={!isPermitted}
  />
);

const UninstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({ value, outputListErrors, onChange, index, isPermitted }) => (
  <ExtField
    type="date"
    label={false}
    date={value}
    error={get(outputListErrors[index], 'uninstalled_at', '')}
    time={false}
    onChange={onChange}
    boundKeys={[index, 'uninstalled_at']}
    disabled={!isPermitted}
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
  const vehicleList = [...props.batteryAvailableCarList, ...inputList].map(
    ({ car_id, gov_number }) => ({ label: gov_number, value: car_id }),
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
