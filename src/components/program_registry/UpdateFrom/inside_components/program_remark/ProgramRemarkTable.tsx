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
        name: 'supplied_at',
        displayName: 'Дата создания',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'group_name',
        displayName: 'Замечание',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'number',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'name',
        displayName: 'ФИО',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'measure_unit_name',
        displayName: 'Статус',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    supplied_at: ({ data }) => (<DateFormatter date={data} />),
  };

  return (
    <DataTable
      title="Замечания"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      noFilter
      {...props}
    />
  );
};

export default Table;
