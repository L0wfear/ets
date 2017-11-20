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
        name: 'reviewed_at',
        displayName: 'Дата осмотра',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'percent',
        displayName: 'Процент выполнения',
        type: 'number',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'created_at',
        displayName: 'Дата внесения записи',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fio',
        displayName: 'Линейщик',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Группа',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

const renderers: ISchemaRenderer = {
  reviewed_at: ({ data }) => (<DateFormatter date={data} />),
  see_at: ({ data }) => (<DateFormatter date={data} />),
};

const Table: React.SFC<any> = props  => {
  return (
    <DataTable
      title="Проставление процента выполнения работ"
      noFilter={true}
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};

export default Table;
