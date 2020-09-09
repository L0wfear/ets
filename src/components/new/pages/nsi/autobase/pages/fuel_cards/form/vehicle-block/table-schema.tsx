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
  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      time={false}
      error={outputListErrors[index]?.installed_at ?? ''}
      onChange={onChange}
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

  return (
    <ExtField
      type="date"
      label={false}
      date={value}
      error={outputListErrors[index]?.uninstalled_at ?? ''}
      time={false}
      onChange={onChange}
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

export const renderers: TRendererFunction = (props, onListItemChange) => {
  const inputList = props.inputList.filter((filterItem) =>
    Boolean(filterItem.gov_number),
  );
  const vehicleList = uniqBy(
    [
      ...props.fuelCardsAvailableCarList.options, ...inputList.map(
        (rowData) => ({ label: rowData.gov_number, value: rowData.car_id, rowData }),
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
  };
};
