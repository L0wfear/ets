import * as React from 'react';
import { ExtField } from 'components/ui/Field.jsx';

import { IDataTableSchema, ISchemaRenderer } from 'components/ui/table/@types/schema.h';

export const meta: IDataTableSchema = {
  cols: [
    {
      name: 'car_id',
      displayName: 'Рег. номер ТС',
    },
    {
      name: 'installed_at',
      displayName: 'Дата монтажа',
      type: 'date',
    },
    {
      name: 'uninstalled_at',
      displayName: 'Дата демонтажа',
      type: "date",
    },
  ],
};

export interface IPropsTableDataInput<TTableRow = any> {
  state: TTableRow;
  errors: ETSCore.Types.IStringKeyHashTable<string>;
}

const CarIdRenderer = ({ state, errors, vehicleList}) =>
  <ExtField
    type="select"
    label=""
    options={vehicleList}
    value={state.car_id}
    error={errors.car_id}
    onChange={this.handleChange}
    boundKeys={['car_id']}
  />;

export const renderers: (props: any) => ISchemaRenderer = props => ({
  car_id: ({ data }) => <CarIdRenderer {...props} value={data} />,
});
