import * as React from 'react';
import { uniqBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import {
  IPropsDataTableInputRenderer,
  TRendererFunction,
} from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { oldestInstalledDateIndex } from '../../../battery_registry/form/schema';
import { get } from 'lodash-es';
import { createValidDateTime, setDateTime0am, setDateTime2359 } from 'components/@next/@utils/dates/dates';

export const validationSchema: SchemaType<ValuesOf<FuelCard['fuel_card_on_cars']>, any> = {
  properties: {
  },
};

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'car_id',
      displayName: 'Рег. номер ТС',
      type: 'select',
      cssClassName: 'width150'
    },
    {
      name: 'installed_at',
      displayName: 'Дата с',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'uninstalled_at',
      displayName: 'Дата по',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'decouple_reason',
      displayName: 'Причина отвязки',
      type: 'input',
      cssClassName: 'width150',
    },
  ],
};

type IPropsCarIdRenderer = {
  vehicleList: FuelCard['fuel_card_on_cars'];
} & IPropsDataTableInputRenderer;
type PropsUninstalledAtRenderer = {
  origin_fuel_card_on_cars: FuelCard['origin_fuel_card_on_cars'];
} & IPropsDataTableInputRenderer;

const CarIdRenderer: React.FC<IPropsCarIdRenderer> = ({
  value,
  outputListErrors = [],
  vehicleList = [],
  onChange,
  index,
  isPermitted,
  inputList,
  isPermittedToUpdateCards,
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
      placeholder={'Малая механизация'}
      disabled={
        (!isPermitted || inputList[index]?.alredy_save)
        && !isPermittedToUpdateCards
      }
    />
  );
};

const InstalledAtRenderer: React.FC<
  IPropsDataTableInputRenderer
> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
  inputList,
  isPermittedToUpdateCards,
}) => {

  const prevVal = inputList[index]['installed_at'];

  const handleChange = (_, key, valueNew) => {
    onChange(
      index,
      {
        [key]: !prevVal
          ? createValidDateTime(setDateTime0am(valueNew))
          : valueNew,
      },
    );
  };

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={true}
      error={outputListErrors[index]?.installed_at ?? ''}
      onChange={handleChange}
      boundKeys={[index, 'installed_at']}
      disabled={
        (!isPermitted || inputList[index]?.alredy_save)
        && !isPermittedToUpdateCards
      }
      makeGoodFormat
    />
  );
};

const UninstalledAtRenderer: React.FC<
  PropsUninstalledAtRenderer
> = ({
  value,
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
  inputList,
  origin_fuel_card_on_cars = [],
  isPermittedToUpdateCards,
}) => {

  const rowValue = inputList[index];

  const oldestDateIndex = oldestInstalledDateIndex(inputList);
  const isOldestInstaledAtRow = oldestDateIndex === index;
  const rowValueOrigin = origin_fuel_card_on_cars.find((elem) => elem.id === rowValue.id);

  const prevVal = inputList[index]['uninstalled_at'];
  const handleChange = (_, key, valueNew) => {
    onChange(
      index,
      {
        [key]: !prevVal
          ? createValidDateTime(setDateTime2359(valueNew))
          : valueNew,
      },
    );
  };

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      error={outputListErrors[index]?.uninstalled_at ?? ''}
      time={true}
      onChange={handleChange}
      boundKeys={[index, 'uninstalled_at']}
      disabled={
        (
          !isPermitted
          || (
            inputList[index]?.alredy_save
            && Boolean(get(rowValueOrigin, 'uninstalled_at'))
            && !isOldestInstaledAtRow
          )
        )
        && !isPermittedToUpdateCards
      }
      makeGoodFormat
    />
  );
};

const DecoupleReasonRenderer: React.FC<
  PropsUninstalledAtRenderer
> = ({
  outputListErrors = [],
  onChange,
  index,
  isPermitted,
  isPermittedToUpdateCards,
  value,
  inputList,
  origin_fuel_card_on_cars,
}) => {

  const handleChange = React.useCallback(
    (key, valueNew) => {
      onChange(index, key, valueNew);
    },
    [index],
  );

  const rowValue = inputList[index];

  const rowValueOrigin = origin_fuel_card_on_cars.find((elem) => elem.id === rowValue.id);

  return (
    <ExtField
      id="decouple_reason"
      type="string"
      label={false}
      error={outputListErrors[index]?.decouple_reason ?? ''}
      value={value}
      onChange={handleChange}
      boundKeys={'decouple_reason'}
      disabled={
        !isPermitted && !isPermittedToUpdateCards
        || !Boolean(inputList[index]?.uninstalled_at)
        || Boolean(rowValueOrigin?.uninstalled_at) && Boolean(rowValueOrigin?.decouple_reason)
      }
    />
  );
};

export const renderers: TRendererFunction = (props, onListItemChange) => {
  const inputList = props.inputList.filter((filterItem) =>
    Boolean(filterItem.gov_number),
  );
  const vehicleList = uniqBy(
    [
      ...props.fuelCardsAvailableCarList.options, ...inputList.map(
        (rowData) => ({ label: rowData.gov_number, value: rowData.car_id, isDisabled: true, rowData }),
      )
    ],
    'value',
  );

  const {
    isPermittedToUpdateCards
  } = props;

  return {
    car_id: (rowMeta) => (
      <CarIdRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        vehicleList={vehicleList}
        isPermittedToUpdateCards={isPermittedToUpdateCards}
      />
    ),
    installed_at: (rowMeta) => (
      <InstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        isPermittedToUpdateCards={isPermittedToUpdateCards}
      />
    ),
    uninstalled_at: (rowMeta) => (
      <UninstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        origin_fuel_card_on_cars={props.origin_fuel_card_on_cars}
        isPermittedToUpdateCards={isPermittedToUpdateCards}
      />
    ),
    decouple_reason: (rowMeta) => (
      <DecoupleReasonRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        isPermittedToUpdateCards={isPermittedToUpdateCards}
      />
    ),
  };
};
