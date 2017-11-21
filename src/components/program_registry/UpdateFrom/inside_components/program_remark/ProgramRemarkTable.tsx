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
        filter: false,
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

const checkShowByStatusAndDataLength = (status, length) => {
  if (status === 'draft') {
    return false;
  }

  if (length > 0 || status === 'rejected') {
    return true;
  }

  return false;
};

const renderers: ISchemaRenderer = {
  created_at: ({ data }) => (<DateFormatter date={data} />),
  status: ({ data }) => <span>{status_name[data]}</span>,
};

const Table: React.SFC<any> = props  => {
  const showTable = checkShowByStatusAndDataLength(props.program_version_status, props.data.length);

  return showTable ?
    <DataTable
      title="Замечания"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      noFilter
      griddleHidden={!props.displayTable}
      className="program-remark"
      {...props}
    />
    :
    <div></div>;
};

export default Table;
