import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}) {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'district',
        displayName: 'Район',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'location',
        displayName: 'Местоположение объекта',
        display: false,
        type: 'string',
        filter: false,
      },

      {
        name: 'crossing',
        displayName: 'Пересечение',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'created_at',
        displayName: 'Год ввода в эксплуатацию',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'global_id',
        displayName: 'Идентификатор моста',
        display: false,
        type: 'string',
        filter: false,
      },
    ],
  };

  return meta;
}

export const renderers = {
  created_at: ({ data }) => <DateFormatter date={data} time={false} />,
};

export default (props) => {
  return (
    <DataTable
      title="Мосты"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      {...props}
    />
  );
};
