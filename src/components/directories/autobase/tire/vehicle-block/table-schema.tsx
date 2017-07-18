import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/ui/Field.jsx';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTableInputRenderer, TRendererFunction  } from 'components/ui/table/@types/DataTableInput.h';
import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { ITireAvailableCar } from 'api/@types/services/autobase.h';

export const validationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Рег. номер ТС',
      type: 'number',
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
    },
    {
      name: 'installed_at',
      displayName: 'Дата монтажа',
      type: 'date',
      cssClassName: 'width150',
    },
    {
      name: 'uninstalled_at',
      displayName: 'Дата демонтажа',
      type: "date",
      cssClassName: 'width150',
    },
  ],
};

interface IPropsCarIdRenderer extends IPropsDataTableInputRenderer {
  vehicleList: ITireAvailableCar[];
}

const CarIdRenderer: React.SFC<IPropsCarIdRenderer> = ({ value, outputListErrors = [], vehicleList = [], onChange, index}) =>
  <ExtField
    type="select"
    label=""
    options={vehicleList}
    value={value}
    error={get(outputListErrors[index], 'car_id', '')}
    onChange={onChange}
    boundKeys={[index, 'car_id']}
  />;

const InstalledAtRenderer: React.SFC<IPropsDataTableInputRenderer> = ({ value, onChange, index}) =>
  <ExtField
    type="date"
    label=""
    date={value}
    time={false}
    onChange={onChange}
    boundKeys={[index, 'installed_at']}
  />;

const UninstalledAtRenderer: React.SFC<IPropsDataTableInputRenderer> = ({ value, onChange, index}) =>
  <ExtField
    type="date"
    label=""
    date={value}
    time={false}
    onChange={onChange}
    boundKeys={[index, 'uninstalled_at']}
  />;

export const renderers: TRendererFunction = (props, onListItemChange) => {
  const vehicleList = props.tireAvailibleCarList.map(({ car_id, gov_number }) => ({ label: gov_number, value: car_id }));

  return {
    car_id: rowMeta =>
      <CarIdRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
        vehicleList={vehicleList}
      />,
    installed_at: rowMeta =>
      <InstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />,
    uninstalled_at: rowMeta =>
      <UninstalledAtRenderer
        {...props}
        onChange={onListItemChange}
        value={rowMeta.data}
        index={rowMeta.rowData.rowNumber - 1}
      />,
    };
};
