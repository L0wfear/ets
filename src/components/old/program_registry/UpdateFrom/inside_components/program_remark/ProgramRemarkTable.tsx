import * as React from 'react';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';

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

const checkPermittedTable = (status, length, isСustomer, isSupervisor) => {
  if (status === 'draft') {
    return false;
  }

  if (isСustomer && (length > 0 || status === 'rejected')) {
    return true;
  }

  if (isSupervisor && (length > 0  || status === 'sent_on_review' || status === 'closed')) {
    return true;
  }

  return false;
};

const renderers: ISchemaRenderer = {
  created_at: ({ data }) => makeDateFormated(data, true),
  status: ({ data }) => <span>{status_name[data]}</span>,
};

const Table: React.FC<any> = (props) => {
  const showTable = checkPermittedTable(props.program_version_status, props.data.length, props.isСustomer, props.isSupervisor);

  return showTable
    ? <DataTable
      title="Замечания"
      results={props.data}
      initialSort={props.selectField}
      renderers={renderers}
      tableMeta={tableMeta(props)}
      noFilter
      griddleHidden={!props.displayTable}
      className="program-remark"
      {...props}
    />
    :    <div></div>;
};

export default Table;
