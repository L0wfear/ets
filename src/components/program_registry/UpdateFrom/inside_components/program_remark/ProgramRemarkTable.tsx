import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

const status_name = {
  created: 'Создано',
  fixed: 'Выполнено',
  rejected: 'Отклонено',
};


export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'created_at',
        displayName: 'Дата создания',
        type: 'date',
        filter: false,
      },
      {
        name: 'remark',
        displayName: 'Замечание',
        type: 'string',
        filter: false,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'fio',
        displayName: 'ФИО',
        type: 'string',
        filter: false,
      },
      {
        name: 'status',
        displayName: 'Статус',
        type: 'string',
        filter: false,
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const renderers: ISchemaRenderer = {
    created_at: ({ data }) => (<DateFormatter date={data} />),
    status: ({ data }) => <span>{status_name[data]}</span>,
  };

  return (
    <DataTable
      title="Замечания"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      noFilter
      className="auto-height-table"
      {...props}
    />
  );
};

export default Table;
