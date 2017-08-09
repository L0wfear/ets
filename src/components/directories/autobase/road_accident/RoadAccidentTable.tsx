import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'accident_date',
        displayName: 'Дата',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'driver_fio',
        displayName: 'Водитель',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'cause_name',
        displayName: 'Причина ДТП',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'accident_place',
        displayName: 'Место ДТП',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_guilty',
        displayName: 'Виновность',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'damage_price',
        displayName: 'Стоимость ущерба, руб.',
        type: 'number',
        filter: {
          type: 'number',
        },
      },
      {
        name: 'comment',
        displayName: 'Примечание',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const {
          car_id = -1,
        } = props;

  const renderers: ISchemaRenderer = {
    accident_date: ({ data }) => (<DateFormatter date={data} />),
    is_guilty: ({ data }) => <input type="checkbox" disabled checked={data} />,
  };

  return (
    <DataTable
      title="Реестр ДТП"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
